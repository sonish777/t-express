import { ExceptionHandler } from 'core/exceptions/handlers';
import { HttpStatus } from 'core/utils/http-status-code.util';
import { ForbiddenException } from 'shared/exceptions';
import { Request, Response, NextFunction } from 'express';

export class ForbiddenExceptionHandler extends ExceptionHandler {
    public handle(
        error: ForbiddenException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        if (error.statusCode !== HttpStatus.FORBIDDEN) {
            return next(error);
        }
        req.flash('error:toast', error.message);
        return res.redirect('back');
    }
}
