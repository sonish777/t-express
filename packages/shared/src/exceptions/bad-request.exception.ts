import { HttpException } from 'core/exceptions';
import { HttpStatus } from 'core/utils';

export class BadRequestException extends HttpException {
    constructor(public readonly message = 'Bad request') {
        super(HttpStatus.BAD_REQUEST, message, BadRequestException.name, true);
    }
}
