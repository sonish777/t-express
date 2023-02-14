import { Express } from 'express';
import cors from 'cors';
import { ProviderStaticMethod } from 'core/providers';
import config, { IConfig } from 'config';

const serverConfig = config.get<IConfig>('server');
const cmsUrl = `${serverConfig.get<string>(
    'cms:host'
)}:${serverConfig.get<string>('cms:port')}`;
const apiUrl = `${serverConfig.get<string>(
    'api:host'
)}:${serverConfig.get<string>('api:port')}`;

export class CORSProvider implements ProviderStaticMethod<typeof CORSProvider> {
    public static register(app: Express, whitelist: string[] = []) {
        if (process.env.NODE_ENV === 'development') {
            app.use(cors());
        } else {
            whitelist = [cmsUrl, apiUrl, ...whitelist];
            app.use(
                cors({
                    origin: function (requestOrigin, callback) {
                        if (
                            !requestOrigin ||
                            whitelist.indexOf(requestOrigin) !== -1
                        ) {
                            callback(null, true);
                        } else {
                            callback(new Error('Not allowed by CORS'));
                        }
                    },
                })
            );
        }
    }
}
