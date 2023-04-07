import Container from 'typedi';
import { RabbitMQClient } from '../rabbitmq.service';

export function InjectRMQ(): any {
    return (target: any, prop: string | symbol) => {
        const rmqClient = Container.get<RabbitMQClient>('RMQ_SERVICE');
        Object.defineProperty(target, prop, {
            value: rmqClient,
            writable: true,
        });
        return target;
    };
}
