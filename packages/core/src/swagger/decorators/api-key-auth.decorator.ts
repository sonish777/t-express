export function ApiKeyAuth(root = false): any {
    if (root === true) {
        return function (target: Function): void {
            Reflect.defineMetadata('ApiKeyAuth', true, target);
        } as ClassDecorator;
    }
    return function (target, propKey) {
        Reflect.defineMetadata('ApiKeyAuth', true, target.constructor, propKey);
    } as MethodDecorator;
}
