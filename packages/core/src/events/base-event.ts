import EventEmitter from 'events';

export abstract class BaseEvent<TEvents extends Record<string, any>> {
    private emitter = new EventEmitter();

    emit<TEventName extends keyof TEvents>(
        eventName: TEventName & string,
        ...args: TEvents[TEventName]
    ) {
        this.emitter.emit(eventName, ...(args as TEvents[TEventName][]));
    }

    on<TEventName extends keyof TEvents>(
        eventName: TEventName & string,
        handler: (...args: TEvents[TEventName]) => void
    ) {
        this.emitter.on(eventName, handler as any);
    }
}
