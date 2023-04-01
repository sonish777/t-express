import config from 'config';

export const ServerConfig = {
    URL: `${config.get('server.api:host')}:${config.get('server.api:port')}`,
    PORT: process.env.API_PORT || config.get('server.api:port'),
    API_KEY: config.get<string>('server.api_key'),
};
