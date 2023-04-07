import { ValidationBuilder } from 'core/utils';
import { ValidatorWithStaticProps } from 'core/validators';
import { ValidationChain } from 'express-validator';
import { SocialLoginEnum } from '@api/types';

export class SocialLoginValidator
    implements ValidatorWithStaticProps<typeof SocialLoginValidator>
{
    static get rules(): Record<string, ValidationChain> {
        return {
            socialType: ValidationBuilder.ForField('socialType')
                .Required({ fieldDisplayName: 'Social Type' })
                .IsEnum(SocialLoginEnum, {
                    fieldDisplayName: 'Social Type',
                })
                .build(),
            accessToken: ValidationBuilder.ForField('accessToken')
                .Required({ fieldDisplayName: 'Access Token' })
                .build(),
        };
    }
}
