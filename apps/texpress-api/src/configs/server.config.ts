import config from 'config';

export const ServerConfig = {
    PORT: process.env.API_PORT || config.get('server.api:port'),
};
