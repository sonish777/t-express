import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class CreateUserDto {
    @SchemaProperty({
        type: 'string',
    })
    firstName: string;

    @SchemaProperty({
        type: 'string',
    })
    lastName: string;

    @SchemaProperty({
        type: 'string',
    })
    dob: string;

    @SchemaProperty({
        type: 'string',
    })
    gender: string;

    @SchemaProperty({
        type: 'string',
    })
    email: string;

    @SchemaProperty({
        type: 'string',
    })
    mobileNumber: string;

    @SchemaProperty({
        type: 'string',
    })
    password: string;
}
