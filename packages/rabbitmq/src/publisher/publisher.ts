import { RabbitMQClient, InjectRMQ } from '../service';
import { Service } from 'typedi';

@Service()
export class Publisher {
    @InjectRMQ() private client: RabbitMQClient | Promise<RabbitMQClient>;

    private async createExchange(name: string, type: string, durable = true) {
        if (this.client instanceof Promise) {
            this.client = await this.client;
        }
        this.client.channel.assertExchange(name, type, { durable });
        return this;
    }

    private async createQueue(name: string, durable = true) {
        if (this.client instanceof Promise) {
            this.client = await this.client;
        }
        await this.client.channel.assertQueue(name, { durable });
        return this;
    }

    async registerQueues(
        exchange: string,
        routingKeys: string[],
        options: {
            durableExchange: boolean;
            durableQueue: boolean;
        } = {
            durableExchange: true,
            durableQueue: true,
        }
    ) {
        if (this.client instanceof Promise) {
            this.client = await this.client;
        }
        await this.createExchange(exchange, 'direct', options.durableExchange);
        for (const route of routingKeys) {
            const queue = `${exchange}.${route}`;
            await this.createQueue(queue, options.durableQueue);
            await this.client.channel.bindQueue(queue, exchange, route);
        }
    }

    async publish(exchange: string, routingKey: string, message: any) {
        if (this.client instanceof Promise) {
            this.client = await this.client;
        }
        await this.client.channel.publish(
            exchange,
            routingKey,
            Buffer.from(
                typeof message === 'object' ? JSON.stringify(message) : message
            )
        );
    }
}
