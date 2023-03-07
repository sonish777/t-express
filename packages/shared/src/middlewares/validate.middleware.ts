import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from 'express-validator/src/base';
import { UnprocessableEntityException } from '../exceptions';

export const validate = (req: Request, _res: Response, next?: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error: UnprocessableEntityException<
            ValidationError[] | Record<string, ValidationError>
        >;
        if (req.headers.accept === 'application/json') {
            error = new UnprocessableEntityException(errors.array());
        } else {
            error = new UnprocessableEntityException(errors.mapped());
        }
        if (!next) {
            throw error;
        }
        return next(error);
    }
    if (next) {
        next();
    }
};
