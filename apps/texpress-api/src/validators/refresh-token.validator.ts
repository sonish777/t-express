import { ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';

export class RefreshTokenValidator
    implements ValidatorWithStaticProps<typeof RefreshTokenValidator>
{
    static get rules(): Record<string, ValidationChain> {
        return {
            refreshToken: ValidationBuilder.ForField('refreshToken')
                .Required({ fieldDisplayName: 'Refresh token' })
                .build(),
        };
    }
}
