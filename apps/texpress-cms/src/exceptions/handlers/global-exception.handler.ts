import { HttpException } from 'core/exceptions';
import { ExceptionHandler } from 'core/exceptions';
import { HttpStatus } from 'core/utils';
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
                    return res.render(
                        'errors/500',
                        process.env.NODE_ENV === 'development'
                            ? {
                                  errorName: error.name,
                                  errorMessage: error.message,
                                  errorStack: error.stack,
                              }
                            : {}
                    );
            }
        }
        req.flash('error:toast', error.message);
        return res.redirect('back');
    }
}
