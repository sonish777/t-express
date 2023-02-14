import { HttpException } from 'core/exceptions';
import { HttpStatus } from 'core/utils';

export class ForbiddenException extends HttpException {
    constructor(
        public readonly message: string = 'You are not allowed to perform this action'
    ) {
        super(HttpStatus.FORBIDDEN, message, ForbiddenException.name, true);
    }
}
