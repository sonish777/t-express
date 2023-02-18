import { Expose } from 'class-transformer';

export class SetPasswordDto {
    @Expose() username: string;
    @Expose() password: string;
    @Expose() confirmPassword: string;
}
