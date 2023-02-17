import { Express } from 'express';
import passport from 'passport';
import Container from 'typedi';
import config from 'config';
import { AuthService } from '@api/services';
import { ProviderStaticMethod } from 'core/providers';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

export class PassportProvider
    implements ProviderStaticMethod<typeof PassportProvider>
{
    private static readonly _authService = Container.get(AuthService);

    public static register(app: Express) {
        app.use(passport.initialize());
        passport.use(
            new JWTStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: config.get<string>('jwt.access:secret'),
                },
                async (payload, done) => {
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
}
