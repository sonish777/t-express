import { Class, StartupOptions } from 'core/interfaces';
import { Server } from 'core/server';
import { ConsumersMetadataKeys } from 'core/utils';
import { Consumer } from './consumer.base';
import Container from 'typedi';

export class ConsumerServer extends Server {
    constructor(
        private readonly options?: {
            consumers?: { [key: string]: new (...args: any) => Consumer };
            controllers?: { [key: string]: Class };
        }
    ) {
        super(options?.controllers);
    }

    subscribeConsumers() {
        const consumers = this.options?.consumers;
        if (!consumers) {
            return;
        }
        Object.values(consumers).forEach(async (consumer) => {
            const consumerInstance = Container.get(consumer);
            const consumers =
                Reflect.getMetadata(
                    ConsumersMetadataKeys.CONSUMERS,
                    consumerInstance
                ) || [];
            consumerInstance.queues.push(...consumers);
            await consumerInstance.configure.bind(consumerInstance)();
        });
    }

    startupConsumer(port: number, options: StartupOptions = {}) {
        this.registerRoutes();
        this.subscribeConsumers();
        this.applyMiddlewares(options.middlewares, options.middlewareProviders);
        this.startup(port, options);
    }
}
