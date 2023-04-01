export function ApiBearerAuth(): MethodDecorator {
    return (target, propKey) => {
        Reflect.defineMetadata(
            'ApiBearerAuth',
            true,
            target.constructor,
            propKey
        );
    };
}
