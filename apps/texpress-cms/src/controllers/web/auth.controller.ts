import { Request, Response } from 'express';
import passport from 'passport';
import {
    BaseController,
    Controller,
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

@Controller('/auth')
export class AuthController extends BaseController {
    protected _baseView = 'base-login';
    _title = 'Auth';
    _viewPath = 'auth';
    _module = 'auth';

    constructor(private readonly authService: AuthService) {
        super();
    }

    @Route({
        path: '/login',
        method: HTTPMethods.Get,
        middlewares: [redirectIfLoggedIn()],
    })
    loginView(_req: Request, res: Response) {
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
    login(_req: Request, res: Response) {
        return res.redirect('/home');
    }

    @Route({
        path: '/logout',
        method: HTTPMethods.Get,
    })
    logout(req: Request, res: Response) {
        req.logOut((err) => {
            if (err) {
                console.log(err);
            }
        });
        return res.redirect('/auth/login');
    }
}
