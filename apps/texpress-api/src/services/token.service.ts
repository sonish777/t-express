import { TokenEntity } from '@api/entities';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { ApiUserEntity } from 'shared/entities';
import { Repository } from 'typeorm';
import jwt, { JsonWebTokenError, SignOptions } from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from 'shared/exceptions';
import { AuthService } from './auth.service';
import { CommonConfigs } from '@api/configs';

interface IVerifiedToken {
    _id: string;
    sub: string;
    jti: string;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

@Service()
export class TokenService extends BaseService<TokenEntity> {
    @GetRepository(TokenEntity)
    protected repository: Repository<TokenEntity>;
    /* To avoid circular dependency, reference service this way */
    @Inject(() => AuthService)
    private readonly authService: AuthService;

    async signTokens(user: ApiUserEntity): Promise<ITokens> {
        const payload = { _id: user._id };
        const accessToken = jwt.sign(payload, CommonConfigs.Jwt.AccessSecret, {
            expiresIn: CommonConfigs.Jwt.AccessExpiresIn,
        });
        const token = await this.create({
            userId: user.id,
        });
        const refreshToken = jwt.sign(
            payload,
            CommonConfigs.Jwt.RefreshSecret,
            {
                expiresIn: CommonConfigs.Jwt.RefreshExpiresIn,
                jwtid: String(token.id),
                subject: user._id,
            }
        );
        return { accessToken, refreshToken };
    }

    async revoke(jwtToken: string): Promise<TokenEntity> {
        const { jti } = this.verify(jwtToken);
        const token = await this.repository.findOne({
            where: { id: Number(jti) },
        });
        if (!token) {
            throw new NotFoundException('Token not found');
        }
        token.isRevoked = true;
        return this.repository.save(token);
    }

    async refresh(
        refreshToken: string
    ): Promise<Omit<ITokens, 'refreshToken'>> {
        const { token, user } = await this.decode(refreshToken);
        return this.sign(user, token);
    }

    sign(
        user: ApiUserEntity,
        token?: TokenEntity
    ): Omit<ITokens, 'refreshToken'> {
        const signOptions: SignOptions = {
            subject: user._id,
        };
        if (token) {
            signOptions.issuer = token._id;
        }
        const accessToken = jwt.sign(
            { _id: user._id },
            CommonConfigs.Jwt.AccessSecret,
            signOptions
        );
        return { accessToken };
    }

    async decode(
        jwtToken: string
    ): Promise<{ user: ApiUserEntity; token: TokenEntity }> {
        const { jti, _id } = this.verify(jwtToken);
        const token = await this.repository.findOne({
            where: { id: Number(jti) },
        });
        if (!token) {
            throw new NotFoundException('Token not found');
        }
        if (token.isRevoked) {
            throw new ForbiddenException('Token has been revoked');
        }
        const user = await this.authService.findOne({ _id });
        if (!user) {
            throw new BadRequestException(
                'User belonging to this token does not exist'
            );
        }
        return { token, user };
    }

    verify(token: string): IVerifiedToken {
        try {
            const decodedPayload = jwt.verify(
                token,
                CommonConfigs.Jwt.RefreshSecret
            );
            return <IVerifiedToken>decodedPayload;
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new BadRequestException('Invalid token');
            }
            throw error;
        }
    }
}
