import { Express, Request } from 'express';
import passport from 'passport';
import Container from 'typedi';
import {
    Strategy as LocalStrategy,
    IStrategyOptionsWithRequest,
} from 'passport-local';
import { AuthService } from '@cms/services';
import { AdminActivityLogEntity, UserEntity } from 'shared/entities';
import { UnauthorizedException } from 'shared/exceptions';
import { validatePassword } from 'core/utils';
import { ProviderStaticMethod } from 'core/providers';
import { Publisher } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';

export class PassportProvider
    implements ProviderStaticMethod<typeof PassportProvider>
{
    private static readonly _authService = Container.get(AuthService);
    private static readonly _publisher = Container.get(Publisher);

    public static register(app: Express) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user: Partial<UserEntity>, done) => {
            if (!user) {
                return done(new UnauthorizedException());
            }
            return done(null, user._id);
        });

        passport.deserializeUser(async (_id: string, done) => {
            const userExists = await PassportProvider._authService.findOne(
                {
                    _id: _id,
                },
                ['role', 'role.permissions']
            );
            if (!userExists) {
                return done(new UnauthorizedException());
            }
            return done(null, userExists);
        });

        const options: IStrategyOptionsWithRequest = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        };
        passport.use(new LocalStrategy(options, PassportProvider._verify));
    }

    private static async _verify(
        req: Request,
        username: string,
        password: string,
        done: Function
    ) {
        try {
            const user = await PassportProvider._authService.findUserForLogin(
                username
            );
            if (!user || !(await validatePassword(password, user.password))) {
                req.flash('error:toast', 'Invalid email or password provided');
                return done(null, false);
            }
            PassportProvider._publisher.publish<
                Partial<AdminActivityLogEntity>
            >(QueueConfig.Cms.Exchange, QueueConfig.Cms.ActivityLogQueue, {
                module: 'Auth',
                action: 'Login',
                description: 'User logged into the system',
                userId: user.id,
                activityTimestamp: new Date(),
            });
            return done(null, user);
        } catch (error: any) {
            req.flash('error:toast', error.message);
            return done(null, false);
        }
    }
}
