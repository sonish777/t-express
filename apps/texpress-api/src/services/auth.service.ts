import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { ApiUserEntity } from 'shared/entities';
import { UserStatusEnum, generateOTP, dateDiffInMinutes } from 'shared/utils';
import { CreateUserDto, RefreshTokenDto, VerifyOTPDto } from '@api/dtos';
import {
    DTO,
    HttpStatus,
    Sanitize,
    ToPlain,
    validatePassword,
} from 'core/utils';
import moment from 'moment';
import { LoginDto, SetPasswordDto } from 'shared/dtos';
import { BadRequestException, UnauthorizedException } from 'shared/exceptions';
import { TokenService } from './token.service';
import { AuthEventsEmitter } from 'shared/events';
import { HttpException } from 'core/exceptions';
import { CommonConfigs } from '@api/configs';
import { Cache } from 'shared/services';

@Service()
export class AuthService extends BaseService<ApiUserEntity> {
    @GetRepository(ApiUserEntity)
    readonly repository: Repository<ApiUserEntity>;
    protected resource: any = 'User';

    constructor(private readonly tokensService: TokenService) {
        super();
    }

    findUserByUsername(username: string) {
        return this.findOrFail([
            { email: username },
            { mobileNumber: username },
        ]);
    }

    async login(username: string, password: string) {
        const user = await this.findUserByUsername(username);
        if (user.status === UserStatusEnum.Inactive) {
            throw new UnauthorizedException('User not verified');
        }
        if (
            !user.password ||
            !(await validatePassword(password, user.password))
        ) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.tokensService.signTokens(user);
    }

    @ToPlain
    @AuthEventsEmitter('send-otp', (user: ApiUserEntity) => [
        {
            user_name: `${user.firstName} ${user.lastName}`,
            otp_code: user.token,
            to_email: user.email,
        },
    ])
    @Sanitize
    async register(
        @DTO
        createUserDto: CreateUserDto
    ) {
        const otp = await this.generateAndSendOTP();
        const user = await this.create({
            ...createUserDto,
            token: otp,
            tokenExpiry: new Date(
                Date.now() + CommonConfigs.Otp.NextOtpWaitTime
            ),
        });
        return user;
    }

    generateAndSendOTP(): Promise<string> {
        if (process.env.NODE_ENV === 'development') {
            return Promise.resolve('000000');
        }
        return generateOTP();
    }

    @Sanitize
    async verifyOtp(@DTO verifyOTPDto: VerifyOTPDto) {
        const { username, otpCode } = verifyOTPDto;
        const user = await this.findUserByUsername(username);
        if (
            user.token !== otpCode ||
            moment().isAfter(moment(user.tokenExpiry))
        ) {
            throw new BadRequestException('Invalid OTP code');
        }
        user.token = '';
        user.tokenExpiry = new Date();
        if (user.status === UserStatusEnum.Inactive) {
            user.status = UserStatusEnum.OTPVerified;
        }
        user.tokenVerified = true;
        return this.repository.save(user);
    }

    @Sanitize
    async setPassword(@DTO setPasswordDto: SetPasswordDto) {
        const user = await this.findUserByUsername(setPasswordDto.username);
        if (user.tokenVerified === false) {
            throw new BadRequestException(
                'Resend and verify OTP to set your password.'
            );
        }
        user.password = setPasswordDto.password;
        user.status = UserStatusEnum.Active;
        user.tokenVerified = false;
        await this.repository.save(user);
        return this.tokensService.signTokens(user);
    }

    @Cache<AuthService, 'getProfile'>((userId) => `profile_${userId}`)
    @ToPlain
    getProfile(userId: number) {
        return this.findOrFail({
            id: userId,
        });
    }

    logout(logoutDto: RefreshTokenDto) {
        return this.tokensService.revoke(logoutDto.refreshToken);
    }

    getAccessTokenFromRefreshToken(refreshTokenDto: RefreshTokenDto) {
        return this.tokensService.refresh(refreshTokenDto.refreshToken);
    }

    @ToPlain
    @AuthEventsEmitter('send-otp', (user: ApiUserEntity) => [
        {
            user_name: `${user.firstName} ${user.lastName}`,
            otp_code: user.token,
            to_email: user.email,
        },
    ])
    async forgotPassword(forgotPasswordDto: Pick<LoginDto, 'username'>) {
        const user = await this.findUserByUsername(forgotPasswordDto.username);
        let timeSinceLastOtp = dateDiffInMinutes(user.tokenExpiry, new Date());
        timeSinceLastOtp = Math.trunc(timeSinceLastOtp) + 1;
        if (timeSinceLastOtp > 0) {
            throw new HttpException(
                HttpStatus.TOO_MANY_REQUESTS,
                `Please wait ${timeSinceLastOtp} minutes before you try again.`,
                'TokenAlreadyAcquired',
                true
            );
        }
        user.token = await this.generateAndSendOTP();
        user.tokenExpiry = new Date(
            Date.now() + CommonConfigs.Otp.NextOtpWaitTime
        );
        return this.repository.save(user);
    }
}
