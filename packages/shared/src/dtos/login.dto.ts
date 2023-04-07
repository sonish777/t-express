import { Schema, SchemaProperty } from 'core/swagger';
@Schema()
export class LoginDto {
    @SchemaProperty({
        type: 'string',
        required: true,
    })
    username: string;

    @SchemaProperty({
        type: 'string',
        required: true,
    })
    password: string;
}
