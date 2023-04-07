import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class RefreshTokenDto {
    @SchemaProperty({
        type: 'string',
    })
    refreshToken: string;
}
