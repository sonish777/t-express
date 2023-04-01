import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class ForgotPasswordDto {
    @SchemaProperty({
        type: 'string',
        required: true,
    })
    username: string;
}
