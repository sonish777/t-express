import { StartupOptions } from 'core/interfaces';
import { Server } from 'core/server';
import { Consumer } from './consumer.base';

export class ConsumerServer extends Server {
    constructor(
        private readonly consumers?: {
            [key: string]: new (...args: any) => Consumer;
        }
    ) {
        super();
    }

    subscribeConsumers() {
        if (!this.consumers) {
            return;
        }
        Object.values(this.consumers).forEach(async (consumer) => {
            const consumerInstance = await new consumer();
            const consumers =
                Reflect.getMetadata('CONSUMERS', consumerInstance) || [];
            consumerInstance.queues.push(...consumers);
            await consumerInstance.configure.bind(consumerInstance)();
        });
    }

    startupConsumer(port: number, options: StartupOptions = {}) {
        this.subscribeConsumers();
        this.startup(port, options);
    }
}
