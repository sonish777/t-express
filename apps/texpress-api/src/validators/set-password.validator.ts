import { ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';

export class SetPasswordValidator
    implements ValidatorWithStaticProps<typeof SetPasswordValidator>
{
    static get rules(): Record<string, ValidationChain> {
        return {
            username: ValidationBuilder.ForField('username')
                .Required({ fieldDisplayName: 'Email or phone number' })
                .build(),
            password: ValidationBuilder.ForField('password')
                .Required({ fieldDisplayName: 'Password' })
                .MinCharacters(8, {
                    fieldDisplayName: 'Password',
                })
                .build(),
            confirmPassword: ValidationBuilder.ForField('confirmPassword')
                .Required({ fieldDisplayName: 'Confirm Password' })
                .MinCharacters(8, { fieldDisplayName: 'Confirm Password' })
                .ConfirmPassword({
                    message: 'Password and Confirm password do not match',
                })
                .build(),
        };
    }
}
