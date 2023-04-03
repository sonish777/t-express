import { Request, Response } from 'express';
import passport from 'passport';
import {
    BaseController,
    Controller,
    ProtectedRequest,
    ProtectedRoute,
    ProtectedTypedBody,
    Route,
    TypedBody,
    TypedQuery,
} from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { redirectIfLoggedIn } from 'shared/middlewares';
import { Log } from '@cms/logger';
import {
    CMSForgotPasswordValidator,
    ResetPasswordValidator,
} from 'shared/validators';
import { AuthService } from '@cms/services';
import { CatchAsync } from 'core/exceptions';
import { ResetPasswordDto } from '@cms/dtos';
import { SkipTwoFA } from 'shared/services';
import { ConsoleLogger } from 'shared/logger';

@Controller('/auth')
export class AuthController extends BaseController {
    protected _baseView = 'base-login';
    _title = 'Auth';
    _viewPath = 'auth';
    _module = 'auth';

    constructor(
        private readonly authService: AuthService,
        private readonly logger: ConsoleLogger
    ) {
        super();
    }

    @Route({
        path: '/login',
        method: HTTPMethods.Get,
        middlewares: [redirectIfLoggedIn()],
    })
    @CatchAsync
    async loginView(_req: Request, res: Response) {
        this.page = 'login';
        this.render(res);
    }

    @Route({ path: '/forgot-password', method: HTTPMethods.Get })
    forgotPasswordView(_req: Request, res: Response) {
        this.page = 'forgot-password';
        this.render(res);
    }

    @Route({
        path: '/forgot-password',
        method: HTTPMethods.Post,
        validators: [CMSForgotPasswordValidator],
    })
    @CatchAsync
    async forgotPassword(req: TypedBody<{ email: string }>, res: Response) {
        await this.authService.forgotPassword(req.body.email);
        req.flash(
            'message:toast',
            'Password recovery email has been sent to your email'
        );
        return res.redirect('back');
    }

    @Route({ path: '/reset-password', method: HTTPMethods.Get })
    @CatchAsync
    async resetPasswordViewRedirect(
        req: TypedQuery<{ token: string }>,
        res: Response
    ) {
        this.page = 'reset-password';
        const token = req.query.token;
        const user = await this.authService.findUserForResetPassword(token);
        return this.render(res, { user });
    }

    @Route({
        path: '/reset-password',
        method: HTTPMethods.Post,
        validators: [ResetPasswordValidator],
    })
    @CatchAsync
    async resetPassword(
        req: TypedQuery<{ token: string }> & TypedBody<ResetPasswordDto>,
        res: Response
    ) {
        this.page = 'reset-password';
        const token = req.query.token;
        await this.authService.resetPassword(token, req.body);
        req.flash('message:toast', 'Password reset successful');
        return res.redirect('/auth/login');
    }

    @Route({
        path: '/login',
        method: HTTPMethods.Post,
        middlewares: [
            passport.authenticate('local', {
                failureRedirect: '/auth/login',
            }),
        ],
    })
    @Log()
    async login(req: ProtectedRequest, res: Response) {
        if (req.user.twoFAEnabled) {
            if (!req.user.twoFASecret) {
                // 2FA is enabled but not setup yet.
                await this.authService.generate2FASecretAndQRCode(req.user);
            }
            return res.redirect('/auth/twofa');
        }
        return res.redirect('/home');
    }

    @ProtectedRoute({ method: HTTPMethods.Post, path: '/twofa/verify' })
    @CatchAsync
    async verifyTwoFA(
        req: ProtectedTypedBody<{ token: string }>,
        res: Response
    ) {
        try {
            const token = req.body.token;
            const isValid = await this.authService.verifyTwoFaToken(
                req.user,
                token
            );
            if (!isValid) {
                req.flash('error:toast', 'Invalid token');
                return res.redirect('back');
            }
            req.session.twoFAVerified = true;
            return res.redirect('/home');
        } catch (error) {
            req.logOut(this.logger.error);
            throw error;
        }
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: '/twofa',
    })
    @SkipTwoFA
    @CatchAsync
    async twoFA(req: ProtectedRequest, res: Response) {
        this.page = 'twofa';
        return this.render(res, {
            twoFASetupCompleted: !!req.user.twoFASecret,
        });
    }

    @Route({
        path: '/logout',
        method: HTTPMethods.Get,
    })
    logout(req: Request, res: Response) {
        req.logOut((err) => {
            if (err) {
                this.logger.error(err);
            }
        });
        return res.redirect('/auth/login');
    }
}
