import { UnprocessableEntityException } from '@exceptions/unprocessable-entity.exception';
import { Handler } from 'express';
import { validationResult } from 'express-validator';

export const validate: Handler = (req, _res, next) => {
  const errors = validationResult(req).formatWith(({ msg }) => `- ${msg}`);
  if (!errors.isEmpty()) {
    const mappedErrors = errors.array();
    return next(new UnprocessableEntityException(mappedErrors));
  }
  next();
};
