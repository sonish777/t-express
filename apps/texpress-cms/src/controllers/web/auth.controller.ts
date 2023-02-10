import { Request, Response } from 'express';
import passport from 'passport';
import { BaseController, Controller, Route } from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { redirectIfLoggedIn } from 'shared/middlewares/auth.middleware';

@Controller('/auth')
export class AuthController extends BaseController {
  protected _baseView = 'base-login';
  _title = 'Auth';
  _viewPath = 'auth';
  _module = 'auth';

  @Route({
    path: '/login',
    method: HTTPMethods.Get,
    middlewares: [redirectIfLoggedIn()],
  })
  loginView(req: Request, res: Response) {
    this.page = 'login';
    this.render(res);
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
