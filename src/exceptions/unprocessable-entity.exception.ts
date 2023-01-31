import { HttpException } from '@core/exceptions';
import { HttpStatus } from '@core/utils/http-status-code.util';

export class UnprocessableEntityException extends HttpException {
  constructor(public readonly validationResult: string[]) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity', true);
  }
}
