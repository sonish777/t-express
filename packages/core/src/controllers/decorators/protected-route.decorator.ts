import { TwoFAMetadataKeys } from 'core/utils';
import { auth, ensure2FA } from 'shared/middlewares';
import {} from 'shared/utils';
import { RouteOptions } from '../interfaces';
import { Route } from './route.decorator';

export function ProtectedRoute({
    method,
    path,
    middlewares = [],
    validators = [],
}: RouteOptions): MethodDecorator {
    return (target, prop, descriptor) => {
        const skip2FA = Reflect.getMetadata(
            TwoFAMetadataKeys.SKIP_TWO_FA,
            target,
            prop
        );
        return Route({
            method,
            path,
            middlewares: [
                auth,
                ...(skip2FA ? [] : [ensure2FA]),
                ...middlewares,
            ],
            validators: [...validators],
        })(target, prop, descriptor);
    };
}
