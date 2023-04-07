import 'reflect-metadata';
import { RabbitMQClient, InjectRMQ } from '../service';
import Container from 'typedi';
import { ConsoleLogger } from 'shared/logger';

export class Consumer {
    public queues: { name: string; handler: Function }[] = [];
    @InjectRMQ() private client: RabbitMQClient;
    protected readonly logger = Container.get(ConsoleLogger);

    async configure() {
        if (this.client instanceof Promise) {
            this.client = await this.client;
        }
        for (const queue of this.queues) {
            await this.client.channel.assertQueue(queue.name);
            this.client.channel.consume(queue.name, queue.handler.bind(this), {
                noAck: true,
            });
        }
        this.logger.log(
            'configured queues for',
            this.queues.map((q) => q.name)
        );
    }
}
