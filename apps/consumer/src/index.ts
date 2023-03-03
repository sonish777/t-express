import { ConsumerServer } from 'rabbitmq';
import * as consumers from './cms';

function bootstrap() {
    const server = new ConsumerServer(consumers);
    server.startupConsumer(9999);
}

bootstrap();
