import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new UnauthorizedException('Please login to continue'));
    }
    return next();
};

export const ensure2FA = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next();
    }
    if (req.user.twoFAEnabled && !req.session.twoFAVerified) {
        return next(
            new UnauthorizedException('Two Factor Authentication not verified')
        );
    }
    return next();
};

export const redirectIfLoggedIn =
    (path = '/home') =>
    (req: Request, res: Response, next: NextFunction) => {
        if (res.locals.errorToast && res.locals.errorToast.length > 0) {
            req.flash('error:toast', res.locals.errorToast);
        }
        if (!req.user) {
            return next();
        }
        if (req.user.twoFAEnabled && !req.session.twoFAVerified) {
            return res.redirect('/auth/twofa');
        }
        return res.redirect(path);
    };
