import config from 'config';

export const MailConfig = {
    host: config.get<string>('mail.host'),
    port: config.get<number>('mail.port'),
    username: config.get<string>('mail.username'),
    password: config.get<string>('mail.password'),
    secure: config.get<boolean>('mail.secure'),
    from: config.get<string>('mail.from'),
};
