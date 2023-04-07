import { HTTPMethods, ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';

export class EditPermissionValidator
    implements ValidatorWithStaticProps<typeof EditPermissionValidator>
{
    public static get rules(): Record<string, ValidationChain> {
        return {
            name: ValidationBuilder.ForField('name')
                .Required({ fieldDisplayName: 'Permission name' })
                .MinCharacters(4, {
                    fieldDisplayName: 'Permission name',
                })
                .build(),
            action: ValidationBuilder.ForField('action')
                .Required({ fieldDisplayName: 'Permission action' })
                .MinCharacters(4, { fieldDisplayName: 'Permission action' })
                .build(),
            route: ValidationBuilder.ForField('action')
                .Required({ fieldDisplayName: 'Permission route' })
                .build(),
            method: ValidationBuilder.ForField('method')
                .IsEnum(HTTPMethods, {
                    fieldDisplayName: 'Permission method',
                })
                .build(),
        };
    }
}
