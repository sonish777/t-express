import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class Tokens {
    @SchemaProperty({ type: 'string' })
    accessToken: string;

    @SchemaProperty({ type: 'string' })
    refreshToken: string;
}
