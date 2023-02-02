import { HttpException } from '@core/exceptions';
import { ExceptionHandler } from '@core/exceptions/handlers';
import { HttpStatus } from '@core/utils/http-status-code.util';
import { NextFunction, Request, Response } from 'express';

export class GlobalExceptionHandler extends ExceptionHandler {
  public handle(
    error: HttpException,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    if (!error.isOperational) {
      switch (error.statusCode) {
        case HttpStatus.NOT_FOUND:
          return res.render('errors/404');
        default:
          return res.render('errors/500');
      }
    }
    req.flash('error', error.message);
    return res.redirect('back');
  }
}
