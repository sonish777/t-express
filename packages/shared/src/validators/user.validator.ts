import { ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps, customize } from 'core/validators';
import { Meta, ValidationChain } from 'express-validator';
import { UniqueUserEmailValidator } from './customs';
import { GenderValidator } from './customs/gender.validator';
import { UniqueApiUserEmailValidator } from './customs/unique-email.validator';

export class CreateUserValidator
    implements ValidatorWithStaticProps<typeof CreateUserValidator>
{
    static get rules(): Record<string, ValidationChain> {
        return {
            firstName: ValidationBuilder.ForField('firstName')
                .Required({ fieldDisplayName: 'First name' })
                .MinCharacters(3, { fieldDisplayName: 'First name' })
                .MaxCharacters(25, { fieldDisplayName: 'First name' })
                .build(),
            lastName: ValidationBuilder.ForField('lastName')
                .Required({ fieldDisplayName: 'Last name' })
                .MinCharacters(3, { fieldDisplayName: 'Last name' })
                .MaxCharacters(25, { fieldDisplayName: 'Last name' })
                .build(),
            email: ValidationBuilder.ForField('email')
                .Required({ fieldDisplayName: 'Email' })
                .IsEmail({ fieldDisplayName: 'Email' })
                .Custom(UniqueUserEmailValidator)
                .build(),
            mobileNumber: ValidationBuilder.ForField('mobileNumber')
                .MinCharacters(7, { fieldDisplayName: 'Mobile number' })
                .MaxCharacters(10, { fieldDisplayName: 'Mobile number' })
                .build(),
            dob: ValidationBuilder.ForField('dob')
                .Required({ fieldDisplayName: 'Date of birth' })
                .IsDate({ fieldDisplayName: 'Date of birth' })
                .build(),
            password: ValidationBuilder.ForField('password')
                .If(
                    (_value: string, { req }: Meta) =>
                        req.body.sendActivationLink !== 'on'
                )
                .MinCharacters(8, { fieldDisplayName: 'password' })
                .MaxCharacters(20, { fieldDisplayName: 'password' })
                .build(),
            gender: ValidationBuilder.ForField('gender')
                .Custom(GenderValidator)
                .build(),
        };
    }
}

const updateUserValidatorCustomizer = customize(CreateUserValidator);
updateUserValidatorCustomizer.removeRules(['password']);
export const UpdateUserValidator = updateUserValidatorCustomizer.done();

const createApiUserValidatorCustomizer = customize(CreateUserValidator);
createApiUserValidatorCustomizer.removeRules(['password']);
createApiUserValidatorCustomizer.replace(
    'email',
    ValidationBuilder.ForField('email')
        .Required({ fieldDisplayName: 'Email' })
        .IsEmail({ fieldDisplayName: 'Email' })
        .Custom(UniqueApiUserEmailValidator)
        .build()
);
export const CreateApiUserValidator = createApiUserValidatorCustomizer.done();

const forgotPasswordValidatorCustomizer = customize(CreateUserValidator);
forgotPasswordValidatorCustomizer.removeRules([
    'firstName',
    'lastName',
    'gender',
    'dob',
    'password',
    'mobileNumber',
]);
forgotPasswordValidatorCustomizer.replace(
    'email',
    ValidationBuilder.ForField('email')
        .Required({ fieldDisplayName: 'Email' })
        .IsEmail({ fieldDisplayName: 'Email' })
        .build()
);
export const CMSForgotPasswordValidator =
    forgotPasswordValidatorCustomizer.done();
