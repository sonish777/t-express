import { Expose } from 'class-transformer';
import { Schema, SchemaProperty } from 'core/swagger';

@Schema()
export class CreateUserDto {
    @Expose()
    @SchemaProperty({
        type: 'string',
    })
    firstName: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
    })
    lastName: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
    })
    dob: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
    })
    gender: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
    })
    email: string;

    @Expose()
    @SchemaProperty({
        type: 'string',
    })
    mobileNumber: string;
}
