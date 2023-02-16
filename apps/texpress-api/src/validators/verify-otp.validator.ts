import { ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';

export class VerifyOTPValidator
    implements ValidatorWithStaticProps<typeof VerifyOTPValidator>
{
    static get rules(): Record<string, ValidationChain> {
        return {
            username: ValidationBuilder.ForField('username')
                .Required({ fieldDisplayName: 'Email or Mobile number' })
                .build(),
            otpCode: ValidationBuilder.ForField('otpCode')
                .Required({ fieldDisplayName: 'OTP Code' })
                .build(),
        };
    }
}
