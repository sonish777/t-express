import { Express, Request } from "express";
import passport from "passport";
import Container from "typedi";
import { Strategy as LocalStrategy, IStrategyOptionsWithRequest } from "passport-local";
import { AuthService } from "@services";
import { UserEntity } from "@entities";
import { UnauthorizedException } from "@exceptions";
import { validatePassword } from "@core/utils";
import { ProviderStaticMethod } from "@core/providers";

export class PassportProvider implements ProviderStaticMethod<typeof PassportProvider> {
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
            const userExists = await PassportProvider._authService.findOne({
                _id: _id
            });
            if (!userExists) {
                return done(new UnauthorizedException());
            }
            return done(null, userExists);
        });

        const options: IStrategyOptionsWithRequest = {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        };
        passport.use(new LocalStrategy(options, PassportProvider._verify));
    }

    private static async _verify(req: Request, username: string, password: string, done: Function) {
        try {
            const user = await PassportProvider._authService.findUserForLogin(username);
            if (!user || !(await validatePassword(password, user.password))) {
                req.flash("error", "Invalid email or password provided");
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(null, false);
        }
    }
}
