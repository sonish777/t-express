import { HttpException } from 'core/exceptions';
import { HttpStatus } from 'core/utils';

export class NotFoundException extends HttpException {
    constructor(public readonly message = 'Resource not found') {
        super(HttpStatus.NOT_FOUND, message, NotFoundException.name, true);
    }
}
