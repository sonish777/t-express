import { UnprocessableEntityException } from '@exceptions/unprocessable-entity.exception';
import { Handler } from 'express';
import { validationResult } from 'express-validator';

export const validate: Handler = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.headers.accept === 'application/json') {
      return next(new UnprocessableEntityException(errors.array()));
    }
    return next(new UnprocessableEntityException(errors.mapped()));
  }
  next();
};
