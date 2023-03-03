import config, { IConfig } from 'config';
const exchangeConfig = config.get<IConfig>('queue:exchanges');

export const QueueConfig = {
    Cms: {
        Exchange: exchangeConfig.get<string>('cms'),
        ActivityLogQueue: 'activity_log',
    },
    Api: {
        Exchange: exchangeConfig.get<string>('api'),
    },
} as const;
