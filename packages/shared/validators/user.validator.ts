import { ValidationBuilder } from 'core/utils/validation-builder.util';
import { ValidatorWithStaticProps } from 'core/validators';
import { customize } from 'core/validators/helpers/customize-validator';
import { ValidationChain } from 'express-validator';
import { UniqueEmailValidator } from './customs';
import { GenderValidator } from './customs/gender.validator';

export class CreateUserValidator
  implements ValidatorWithStaticProps<typeof CreateUserValidator>
{
  static get rules(): Record<string, ValidationChain[]> {
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
        .Custom(UniqueEmailValidator)
        .build(),
      mobileNumber: ValidationBuilder.ForField('mobileNumber')
        .MinCharacters(7, { fieldDisplayName: 'Mobile number' })
        .MaxCharacters(10, { fieldDisplayName: 'Mobile number' })
        .build(),
      dob: ValidationBuilder.ForField('dob')
        .IsDate({ fieldDisplayName: 'Date of birth' })
        .build(),
      password: ValidationBuilder.ForField('password')
        .MinCharacters(8, { fieldDisplayName: 'password' })
        .build(),
      gender: ValidationBuilder.ForField('gender')
        .Custom(GenderValidator)
        .build(),
    };
  }
}

const validationCustomizer = customize(CreateUserValidator);
validationCustomizer.removeRules(['password']);
export const UpdateUserValidator = validationCustomizer.done();
