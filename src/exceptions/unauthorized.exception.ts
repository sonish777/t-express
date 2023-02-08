import { HttpException } from '@core/exceptions';
import { HttpStatus } from '@core/utils/http-status-code.util';

export class UnauthorizedException extends HttpException {
  constructor(message = 'You are not authorized') {
    super(HttpStatus.UNAUTHORIZED, message, UnauthorizedException.name, true);
  }
}
