import { HttpException } from '@core/exceptions';
import { HttpStatus } from '@core/utils/http-status-code.util';
import { ValidationError } from 'express-validator';

export class UnprocessableEntityException extends HttpException {
  constructor(
    public readonly validationResult: Record<string, ValidationError>
  ) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity', true);
  }
}
