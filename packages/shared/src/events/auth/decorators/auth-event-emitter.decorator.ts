import { EventEmitterDecoratorFactory } from 'core/events';
import { AuthEvents } from '../auth.event';
import { AuthEventsTypes } from '../interfaces/auth-events.interface';

export const AuthEventsEmitter = <EventName extends keyof AuthEventsTypes>(
    event: EventName,
    mapper: (returnedValue: any) => AuthEventsTypes[EventName] | false
) => EventEmitterDecoratorFactory(AuthEvents, event, mapper);
