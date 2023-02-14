import config from 'config';

export const ServerConfig = {
    PORT: process.env.CMS_PORT || config.get('server.cms:port'),
};
