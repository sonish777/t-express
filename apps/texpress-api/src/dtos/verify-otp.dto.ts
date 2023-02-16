import { Expose } from 'class-transformer';

export class VerifyOTPDto {
    @Expose() username: string;
    @Expose() otpCode: string;
}
