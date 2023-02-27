import { Expose } from 'class-transformer';

export class CreateUserDto {
    @Expose() firstName: string;
    @Expose() lastName: string;
    @Expose() dob: string;
    @Expose() gender: string;
    @Expose() email: string;
    @Expose() mobileNumber: string;
    @Expose() roleId: string;
    @Expose() password: string;
}
