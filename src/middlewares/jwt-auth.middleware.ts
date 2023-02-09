import { UnauthorizedException } from '@exceptions';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, _info) => {
    if (err || !user) {
      return next(new UnauthorizedException());
    }
    return next();
  })(req, res, next);
};
