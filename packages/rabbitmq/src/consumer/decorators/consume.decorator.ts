export function Consume(exchange: string, bindingKey: string): MethodDecorator {
    return (target, prop, descriptor) => {
        const consumers = Reflect.getMetadata('CONSUMERS', target) || [];
        consumers.push({
            name: `${exchange}.${bindingKey}`,
            handler: descriptor.value,
        });
        Reflect.defineMetadata('CONSUMERS', consumers, target);
    };
}
