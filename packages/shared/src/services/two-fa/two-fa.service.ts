import { GeneratedSecret } from 'speakeasy';
import { Service } from 'typedi';
import { Cache, CacheService } from '../cache';
import speakeasy from 'speakeasy';
import { BadRequestException } from 'shared/exceptions';
import QRCode from 'qrcode';

@Service()
export class TwoFAService {
    constructor(private readonly cacheService: CacheService) {}

    async generate2FASecretAndQRCode(
        userId: number
    ): Promise<{ secret: GeneratedSecret; qrCodeData?: string }> {
        let secret = await this.cacheService.get<GeneratedSecret>(
            `user:${userId}_temp_2FA_secret`
        );
        if (secret) {
            return {
                secret,
            };
        }
        secret = await this.generate2FASecret(userId);
        const qrCodeData = await this.generateTwoFAQRCode(userId, secret);
        return {
            secret,
            qrCodeData,
        };
    }

    @Cache<TwoFAService, 'generate2FASecret'>(
        (userId) => `user:${userId}_temp_2FA_secret`,
        300
    )
    async generate2FASecret(_userId: number) {
        return speakeasy.generateSecret();
    }

    async generateTwoFAQRCode(userId: number, secret?: GeneratedSecret | null) {
        if (!secret) {
            secret = await this.cacheService.get<GeneratedSecret>(
                `user:${userId}_temp_2FA_secret`
            );
        }
        if (!secret) {
            throw new BadRequestException('Token expired');
        }
        return QRCode.toDataURL(secret.otpauth_url!);
    }

    async verifyTwoFaToken(
        userId: number,
        token: string,
        twoFASecret?: string
    ) {
        let secret: GeneratedSecret | null = null;
        let base32SecretKey = twoFASecret;
        const cacheKey = `user:${userId}_temp_2FA_secret`;
        if (!base32SecretKey) {
            secret = await this.cacheService.get<GeneratedSecret>(cacheKey);
            base32SecretKey = secret?.base32;
        }
        if (!base32SecretKey) {
            throw new BadRequestException('Token expired');
        }
        const isValid = speakeasy.totp.verify({
            secret: base32SecretKey,
            token,
            encoding: 'base32',
        });
        if (isValid && secret) {
            /* Delete the 2FA secret from cache since, it will be stored to database now */
            await this.cacheService.delete(cacheKey);
        }
        return {
            isValid,
            base32SecretKey,
        };
    }
}
