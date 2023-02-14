import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new UnauthorizedException('Please login to continue'));
    }
    return next();
};

export const redirectIfLoggedIn =
    (path = '/home') =>
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user) {
            return res.redirect(path);
        }
        return next();
    };
