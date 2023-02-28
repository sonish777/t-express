import { Service } from 'typedi';
import { LessThan, Not, Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { UserEntity } from 'shared/entities';
import { BadRequestException, NotFoundException } from 'shared/exceptions';
import { AuthEventsEmitter } from 'shared/events';
import { dateDiffInMinutes, generateOTP, generateToken } from 'shared/utils';
import { ServerConfig } from '@cms/configs';
import { HttpException } from 'core/exceptions';
import { DTO, HttpStatus, Sanitize } from 'core/utils';
import { ResetPasswordDto } from '@cms/dtos';
@Service()
export class AuthService extends BaseService<UserEntity> {
    @GetRepository(UserEntity)
    readonly repository: Repository<UserEntity>;

    async findUserForLogin(username: string) {
        return this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }],
        });
    }

    @AuthEventsEmitter(
        'cms-forgot-password',
        (user: UserEntity & { forgotPasswordUrl: string }) => [
            {
                to_email: user.email,
                reset_password_link: user.forgotPasswordUrl,
                user_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
            },
        ]
    )
    async forgotPassword(email: string) {
        const user = await this.findOne({
            email,
        });
        if (!user) {
            throw new NotFoundException(
                'This email does not exist in our system'
            );
        }
        if (user.tokenExpiry) {
            let timeSinceLastOtp = dateDiffInMinutes(
                user.tokenExpiry,
                new Date()
            );
            timeSinceLastOtp = Math.trunc(timeSinceLastOtp) + 1;
            if (timeSinceLastOtp > 0) {
                throw new HttpException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    `Please wait ${timeSinceLastOtp} minutes before you try again.`,
                    'TokenAlreadyAcquired',
                    true
                );
            }
        }
        user.token = await generateToken();
        user.tokenExpiry = new Date(Date.now() + 600000);
        await this.repository.save(user);
        return {
            ...user,
            forgotPasswordUrl: `${ServerConfig.URL}/auth/reset-password?token=${user.token}`,
        };
    }

    async findUserForResetPassword(token: string) {
        const user = await this.findOne({
            token,
            tokenExpiry: Not(LessThan(new Date())),
        });
        if (!user) {
            throw new BadRequestException('Link has expired');
        }
        return user;
    }

    @Sanitize
    async resetPassword(
        token: string,
        @DTO resetPasswordDto: ResetPasswordDto
    ) {
        const user = await this.findUserForResetPassword(token);
        user.password = resetPasswordDto.password;
        user.token = '';
        user.tokenExpiry = new Date();
        return this.repository.save(user);
    }
}
