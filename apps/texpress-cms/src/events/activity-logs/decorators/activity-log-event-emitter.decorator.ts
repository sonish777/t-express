import { EventEmitterDecoratorFactory } from 'core/events';
import { ActivityLogsEvents } from '../activity-logs.event';
import { ActivityLogEventTypes } from '../interfaces/activity-log-types.interface';

export function ActivityLogEventEmitter<
    EventName extends keyof ActivityLogEventTypes
>(
    event: EventName,
    mapper: (returnedValue: any) => ActivityLogEventTypes[EventName] | false
) {
    return EventEmitterDecoratorFactory(ActivityLogsEvents, event, mapper);
}
