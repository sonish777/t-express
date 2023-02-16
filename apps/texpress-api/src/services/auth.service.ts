import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { ApiUserEntity } from 'shared/entities';
import { generateOTP } from 'shared/utils';
import { CreateUserDto, VerifyOTPDto } from '@api/dtos';
import { DTO, Sanitize } from 'core/utils';
import { HttpException } from 'core/exceptions';
import moment from 'moment';

@Service()
export class AuthService extends BaseService<ApiUserEntity> {
    @GetRepository(ApiUserEntity)
    readonly repository: Repository<ApiUserEntity>;

    async findUserForLogin(username: string) {
        return this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }],
        });
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
    async verifyOtp(@DTO verifyOTPDto: VerifyOTPDto): Promise<ApiUserEntity> {
        const { username, otpCode } = verifyOTPDto;
        const user = await this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }],
        });
        if (!user) {
            throw new HttpException(404, 'User not found', 'NotFoundException');
        }
        if (
            user.token !== otpCode ||
            moment().isAfter(moment(user.tokenExpiry))
        ) {
            throw new HttpException(
                400,
                'Invalid OTP code',
                'BadRequestException'
            );
        }
        user.token = '';
        user.tokenExpiry = new Date();
        user.status = 'active';
        return this.repository.save(user);
    }
}
