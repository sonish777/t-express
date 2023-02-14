import { Express, Request } from 'express';
import passport from 'passport';
import Container from 'typedi';
import {
    Strategy as LocalStrategy,
    IStrategyOptionsWithRequest,
} from 'passport-local';
import { AuthService } from '@cms/services';
import { UserEntity } from 'shared/entities';
import { UnauthorizedException } from 'shared/exceptions';
import { validatePassword } from 'core/utils';
import { ProviderStaticMethod } from 'core/providers';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

export class PassportProvider
    implements ProviderStaticMethod<typeof PassportProvider>
{
    private static readonly _authService = Container.get(AuthService);

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
                ['userRole', 'userRole.role', 'userRole.role.permissions']
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
        passport.use(
            new JWTStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: 'TESTTT!',
                },
                async (payload, done) => {
                    console.log(
                        '🚀 ~ file: passport.provider.ts:57 ~ payload',
                        payload
                    );
                    const user = await PassportProvider._authService.findOne({
                        _id: payload._id,
                    });
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                }
            )
        );
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
                req.flash('loginError', 'Invalid email or password provided');
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            console.log('🚀 ~ file: passport.provider.ts:65 ~ error', error);
            return done(null, false);
        }
    }
}
