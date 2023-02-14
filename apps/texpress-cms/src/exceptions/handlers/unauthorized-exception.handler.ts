import { HttpException } from 'core/exceptions';
import { ExceptionHandler } from 'core/exceptions';
import { HttpStatus } from 'core/utils';
import { Request, Response, NextFunction } from 'express';

export class UnauthorizedExceptionHandler extends ExceptionHandler {
    public handle(
        error: HttpException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        if (error.statusCode !== HttpStatus.UNAUTHORIZED) {
            return next(error);
        }
        req.flash('loginError', error.message);
        return res.redirect('/auth/login');
    }
}
