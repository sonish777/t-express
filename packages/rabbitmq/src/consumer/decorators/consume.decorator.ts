import { ConsumersMetadataKeys } from 'core/utils';

export function Consume(exchange: string, bindingKey: string): MethodDecorator {
    return (target, prop, descriptor) => {
        const consumers =
            Reflect.getMetadata(ConsumersMetadataKeys.CONSUMERS, target) || [];
        consumers.push({
            name: `${exchange}.${bindingKey}`,
            handler: descriptor.value,
        });
        Reflect.defineMetadata(
            ConsumersMetadataKeys.CONSUMERS,
            consumers,
            target
        );
    };
}
