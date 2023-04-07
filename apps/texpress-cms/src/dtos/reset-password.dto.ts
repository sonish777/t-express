import { Expose } from 'class-transformer';

export class ResetPasswordDto {
    @Expose() password: string;
    @Expose() confirmPassword: string;
}
