import { instanceToPlain } from 'class-transformer';

export const ToPlain: MethodDecorator = function (
    _target,
    _prop,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args);
        return instanceToPlain(result);
    };
};
