import { Expose } from 'class-transformer';

export class SetPasswordDto {
    @Expose() password: string;
    @Expose() confirmPassword: string;
}
