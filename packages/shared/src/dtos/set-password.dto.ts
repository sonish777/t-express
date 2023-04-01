import { Expose } from 'class-transformer';
import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class SetPasswordDto {
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
    password: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
        required: true,
    })
    confirmPassword: string;
}
