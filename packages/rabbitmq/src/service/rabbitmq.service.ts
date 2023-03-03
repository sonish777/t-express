import amqp, { Channel, Connection } from 'amqplib';
import config, { IConfig } from 'config';
import Container from 'typedi';

const rabbitmqConfig = config.get<IConfig>('rabbitmq');

export class RabbitMQClient {
    private static _instance: RabbitMQClient;
    private _connection: Connection;
    private _channel: Channel;

    public get connection(): Connection {
        return this._connection;
    }

    public get channel(): Channel {
        return this._channel;
    }

    public static async connect(): Promise<RabbitMQClient> {
        if (!RabbitMQClient._instance) {
            const instance = new RabbitMQClient();
            await this.init(instance);
            RabbitMQClient._instance = instance;
        }
        return RabbitMQClient._instance;
    }

    private static async init(instance: RabbitMQClient) {
        instance._connection = await amqp.connect(rabbitmqConfig.get('url'));
        instance._channel = await instance._connection.createChannel();
        console.log('Queue connection established');
    }
}

Container.set({
    id: 'RMQ_SERVICE',
    factory: () => RabbitMQClient.connect(),
});
