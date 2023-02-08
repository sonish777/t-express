import { HttpException } from '@core/exceptions';
import { HttpStatus } from '@core/utils/http-status-code.util';

export class UnprocessableEntityException<
  ValidationResultType
> extends HttpException {
  constructor(public readonly validationResult: ValidationResultType) {
    super(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'Unprocessable Entity',
      UnprocessableEntityException.name,
      true
    );
  }
}
