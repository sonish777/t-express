import config from 'config';

export const CommonSharedConfigs = {
    Throttle: {
        Attempts: config.get<number>('throttle.attempts'),
        WindowDuration: config.get<number>('throttle.windowDuration'),
        BlockDuration: config.get<number>('throttle.blockDuration'),
    },
};
