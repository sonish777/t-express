import { ConsumeMessage } from 'amqplib';
import { Consume, Consumer } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';

export class ActivityLogConsumer extends Consumer {
    @Consume(QueueConfig.Cms.Exchange, QueueConfig.Cms.ActivityLogQueue)
    OnLog(message: ConsumeMessage) {
        console.log(
            'Message landed on queue cms.activity_log',
            message.content.toString()
        );
    }
}
