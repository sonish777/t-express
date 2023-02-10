import { Request, Response, NextFunction } from 'express';
import { ExceptionHandler } from 'core/exceptions/handlers';
import { HttpStatus } from 'core/utils/http-status-code.util';
import { UnprocessableEntityException } from 'shared/exceptions';
import { ValidationError } from 'express-validator';

export class UnprocessableEntityExceptionHandler extends ExceptionHandler {
  public handle(
    error: UnprocessableEntityException<ValidationError[]>,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error.statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
      return next(error);
    }
    req.flash('mappedErrors', <any>error.validationResult);
    req.flash('inputData', req.body);
    return res.redirect('back');
  }
}
