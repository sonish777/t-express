import { HttpException } from 'core/exceptions';
import {
    APIErrorPayload,
    APIValidationErrorPayload,
    ValidationErrorsArray,
} from '@api/exceptions/interfaces';
import { UnprocessableEntityException } from 'shared/exceptions';
import { ValidationError } from 'express-validator';
import { ApiResponseFormat } from 'core/controllers';
import _ from 'lodash';

export class ApiErrorFormatter {
    static format(
        error: HttpException | UnprocessableEntityException<ValidationError[]>
    ) {
        let errorPayload:
            | Partial<APIErrorPayload>
            | Partial<APIValidationErrorPayload> = {};
        if (error instanceof UnprocessableEntityException) {
            errorPayload = this.formatMultiple(error);
        } else {
            errorPayload = this.formatSingle(error);
        }
        if (process.env.NODE_ENV !== 'development') {
            delete errorPayload.stack;
        }
        return ApiResponseFormat.responseFormat({ error: errorPayload });
    }

    private static formatSingle(error: HttpException): APIErrorPayload {
        if (
            process.env.NODE_ENV === 'development' ||
            error.isOperational === true
        ) {
            return {
                name: error.name || 'Internal Server Error',
                message: error.message || 'Something went wrong',
                statusCode: error.statusCode || 500,
                ...(!error.isOperational ? { stack: error.stack } : {}),
            };
        }
        return {
            name: 'Internal Server Error',
            message: 'Something went wrong',
            statusCode: error.statusCode || 500,
        };
    }

    private static formatMultiple(
        error: UnprocessableEntityException<ValidationError[]>
    ): APIValidationErrorPayload {
        const groupedErrors = _.mapValues(
            _.groupBy(error.validationResult, 'param'),
            (v) => _.flatMap(v, 'msg')
        );
        const errors: ValidationErrorsArray[] = Object.keys(groupedErrors).map(
            (key) => ({
                field: key,
                errors: groupedErrors[key],
            })
        );

        return {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
            detail: errors,
        };
    }
}
