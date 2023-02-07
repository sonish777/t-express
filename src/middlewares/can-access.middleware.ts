import { UserEntity } from '@entities';
import { UnauthorizedException } from '@exceptions';
import { ForbiddenException } from '@exceptions/forbidden.exception';
import { Handler } from 'express';
import _ from 'lodash';

export const canAccess =
  (action = ''): Handler =>
  (req, _res, next) => {
    const user = <UserEntity>req.user;
    if (!user) {
      return next(new UnauthorizedException());
    }
    /* For route, method combination permission checking [action = ""] */
    if (!action) {
      const url = _.trimEnd(req.baseUrl + req.route.path, '/');
      const method = req.method?.toLowerCase();
      const canAccess = user.userRole.role.permissions.some(
        (permission) => permission.route === url && permission.method === method
      );
      if (!canAccess) {
        return next(new ForbiddenException());
      }
      return next();
    }
    /** For action based permission checking [action = "users:create"] */
    const canAccess = user.userRole.role.permissions.some(
      (permission) => permission.action === action
    );
    if (!canAccess) {
      return next(new ForbiddenException());
    }
    return next();
  };
