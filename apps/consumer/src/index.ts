import config from 'config';
import { ConsumerServer } from 'rabbitmq';
import * as consumers from './consumers';
import * as controllers from './controllers';

function bootstrap() {
    const server = new ConsumerServer({
        consumers,
        controllers,
    });
    server.startupConsumer(config.get<number>('server.consumer:port'), {
        name: 'Consumer Server',
    });
}

bootstrap();
