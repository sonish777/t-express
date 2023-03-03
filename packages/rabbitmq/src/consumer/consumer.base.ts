import 'reflect-metadata';
import { RabbitMQClient, InjectRMQ } from '../service';

export class Consumer {
    public queues: { name: string; handler: Function }[] = [];
    @InjectRMQ() private client: RabbitMQClient;

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
        console.log(
            'configured queues for',
            this.queues.map((q) => q.name)
        );
    }
}
