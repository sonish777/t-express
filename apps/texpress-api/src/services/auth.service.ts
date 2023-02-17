import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { ApiUserEntity } from 'shared/entities';
import { UserStatusEnum, generateOTP } from 'shared/utils';
import { CreateUserDto, RefreshTokenDto, VerifyOTPDto } from '@api/dtos';
import { DTO, Sanitize, ToPlain, validatePassword } from 'core/utils';
import moment from 'moment';
import { SetPasswordDto } from 'shared/dtos';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from 'shared/exceptions';
import { TokenService } from './token.service';

@Service()
export class AuthService extends BaseService<ApiUserEntity> {
    @GetRepository(ApiUserEntity)
    readonly repository: Repository<ApiUserEntity>;

    constructor(private readonly tokensService: TokenService) {
        super();
    }

    async login(username: string, password: string) {
        const user = await this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }],
        });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
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

    @Sanitize
    async register(
        @DTO
        createUserDto: CreateUserDto
    ) {
        let otp = '000000';
        if (process.env.NODE_ENV !== 'development') {
            otp = await generateOTP();
        }
        return this.create({
            ...createUserDto,
            token: otp,
            tokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
        });
    }

    @Sanitize
    async verifyOtp(@DTO verifyOTPDto: VerifyOTPDto) {
        const { username, otpCode } = verifyOTPDto;
        const user = await this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (
            user.token !== otpCode ||
            moment().isAfter(moment(user.tokenExpiry))
        ) {
            throw new BadRequestException('Invalid OTP code');
        }
        user.token = '';
        user.tokenExpiry = new Date();
        user.status = UserStatusEnum.OTPVerified;
        await this.repository.save(user);
        return this.tokensService.signTokens(user);
    }

    @Sanitize
    async setPassword(id: number, @DTO setPasswordDto: SetPasswordDto) {
        const user = await this.findOne({
            id,
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.password = setPasswordDto.password;
        return this.repository.save(user);
    }

    @ToPlain
    async getProfile(userId: number) {
        const user = await this.findOne({
            id: userId,
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    logout(logoutDto: RefreshTokenDto) {
        return this.tokensService.revoke(logoutDto.refreshToken);
    }

    getAccessTokenFromRefreshToken(refreshTokenDto: RefreshTokenDto) {
        return this.tokensService.refresh(refreshTokenDto.refreshToken);
    }
}
