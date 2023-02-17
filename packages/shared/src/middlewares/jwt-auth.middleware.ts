import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UnauthorizedException } from '../exceptions';

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return next(new UnauthorizedException());
        }
        req.user = user;
        return next();
    })(req, res, next);
};
