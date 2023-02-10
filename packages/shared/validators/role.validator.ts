import { ValidationBuilder } from 'core/utils/validation-builder.util';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';

export class CreateRoleValidator
    implements ValidatorWithStaticProps<typeof CreateRoleValidator>
{
    static get rules(): Record<string, ValidationChain[]> {
        return {
            name: ValidationBuilder.ForField('name')
                .Required({ fieldDisplayName: 'Role name' })
                .MinCharacters(3, { fieldDisplayName: 'Role name' })
                .build(),
            slug: ValidationBuilder.ForField('slug')
                .Required({ fieldDisplayName: 'Role slug' })
                .MinCharacters(3, { fieldDisplayName: 'Role slug' })
                .build(),
        };
    }
}
