import { TwoFAMetadataKeys } from 'core/utils';

export const SkipTwoFA: MethodDecorator = (target, prop, descriptor) => {
    Reflect.metadata(TwoFAMetadataKeys.SKIP_TWO_FA, true)(target, prop);
    return descriptor;
};
