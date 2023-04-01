import { CommonSearchQuery } from 'core/interfaces';
import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class CommonSearchQueryDto implements CommonSearchQuery {
    @SchemaProperty({
        type: 'string',
    })
    keywords?: string;

    @SchemaProperty({
        type: 'number',
        example: '1',
    })
    page?: number;

    @SchemaProperty({
        type: 'number',
        example: '25',
    })
    take?: number;
}
