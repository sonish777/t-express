import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import { ProviderStaticMethod } from 'core/providers';
import { redisConnection } from 'shared/connections';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis')(session);

export class CommonProvider
    implements ProviderStaticMethod<typeof CommonProvider>
{
    public static register(app: Express) {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(
            session({
                store: new RedisStore({ client: redisConnection.client }),
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: false,
            })
        );
        app.use(cookieParser());
        app.use(flash());
    }
}
