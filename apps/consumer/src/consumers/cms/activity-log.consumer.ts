import { ConsumeMessage } from 'amqplib';
import { GetRepository } from 'core/entities';
import { Consume, Consumer } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';
import { AdminActivityLogEntity } from 'shared/entities';
import { Repository } from 'typeorm';
import { Log } from '../../logger';

export class ActivityLogConsumer extends Consumer {
    @GetRepository(AdminActivityLogEntity)
    private readonly activityLogRepository: Repository<AdminActivityLogEntity>;

    @Consume(QueueConfig.Cms.Exchange, QueueConfig.Cms.ActivityLogQueue)
    @Log(
        'ActivityLog',
        `Consumed on queue: ${QueueConfig.Cms.ActivityLogQueue}`
    )
    async OnLog(message: ConsumeMessage) {
        const logData = JSON.parse(message.content.toString());
        await this.activityLogRepository.save(logData);
    }
}
