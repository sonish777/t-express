import config from 'config';

export const ServerConfig = {
  PORT: process.env.PORT || config.get('server.cms:port'),
};
