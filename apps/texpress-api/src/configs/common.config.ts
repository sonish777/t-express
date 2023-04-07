import config from 'config';

export const CommonConfigs = {
    Jwt: {
        AccessSecret: config.get<string>('jwt.access:secret'),
        AccessExpiresIn: config.get<string>('jwt.access:expiresIn'),
        RefreshSecret: config.get<string>('jwt.refresh:secret'),
        RefreshExpiresIn: config.get<string>('jwt.refresh:expiresIn'),
    },
    Otp: {
        NextOtpWaitTime: config.get<number>('otp.nextOtpWaitTime'),
    },
};
