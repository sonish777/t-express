import { Expose, Transform } from 'class-transformer';

export class CreateRole {
    @Expose() name: string;

    @Expose() slug: string;

    @Expose()
    @Transform(({ value }) =>
        value && !Array.isArray(value) ? [value] : value
    )
    permissions: string[];
}
