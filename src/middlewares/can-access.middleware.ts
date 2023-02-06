import { UserEntity } from '@entities';
import { UnauthorizedException } from '@exceptions';
import { ForbiddenException } from '@exceptions/forbidden.exception';
import { Handler } from 'express';

export const canAccess =
  (action: string): Handler =>
  (req, _res, next) => {
    const user = <UserEntity>req.user;
    if (!user) {
      return next(new UnauthorizedException());
    }
    const canAccess = user.userRole.role.permissions.some(
      (permission) => permission.action === action
    );
    if (!canAccess) {
      return next(new ForbiddenException());
    }
    return next();
  };
