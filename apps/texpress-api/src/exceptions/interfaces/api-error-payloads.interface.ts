export interface APIErrorPayload {
    name: string;
    message: string;
    statusCode: number;
    stack?: string;
}

export interface ValidationErrorsArray {
    field: string;
    errors: string[];
}

export interface APIValidationErrorPayload {
    name: string;
    message: string;
    statusCode: number;
    errors: ValidationErrorsArray[];
    stack?: string;
}
