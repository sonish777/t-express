import { Class } from 'core/interfaces';
import Container from 'typedi';

export function EventEmitterDecoratorFactory<
    EventTypes extends Record<string, any[]>,
    EventName extends keyof EventTypes
>(
    Event: Class,
    event: EventName,
    mapper: (returnedValue: any) => EventTypes[EventName]
): MethodDecorator {
    return (_target, _prop, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);
            const valueToEmit = mapper(result);
            const emitter = Container.get(Event);
            emitter.emit(event, ...valueToEmit);
            return result;
        };
    };
}
