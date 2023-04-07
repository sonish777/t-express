import config from 'config';

export const ServerConfig = {
    URL: `${config.get('server.cms:host')}:${config.get('server.cms:port')}`,
    PORT: process.env.CMS_PORT || config.get('server.cms:port'),
};
