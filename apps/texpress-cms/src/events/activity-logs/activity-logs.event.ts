import { BaseEvent } from 'core/events';
import { Publisher } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';
import { AdminActivityLogEntity } from 'shared/entities';
import { Service } from 'typedi';
import { ActivityLogEventTypes } from './interfaces/activity-log-types.interface';

@Service()
export class ActivityLogsEvents extends BaseEvent<ActivityLogEventTypes> {
    logCmsEventHandler(...cmsEvent: ActivityLogEventTypes['log-event']) {
        const [eventData] = cmsEvent;
        this.publisher.publish<Partial<AdminActivityLogEntity>>(
            QueueConfig.Cms.Exchange,
            QueueConfig.Cms.ActivityLogQueue,
            {
                ...eventData,
            }
        );
    }

    constructor(private readonly publisher: Publisher) {
        super();
        this.on('log-event', this.logCmsEventHandler.bind(this));
    }
}
