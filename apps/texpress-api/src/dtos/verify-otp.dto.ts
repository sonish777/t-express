import { Expose } from 'class-transformer';
import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class VerifyOTPDto {
    @Expose()
    @SchemaProperty({
        type: 'string',
        required: true,
    })
    username: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
        required: true,
    })
    otpCode: string;
}
