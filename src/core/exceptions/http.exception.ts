export class HttpException extends Error {
    constructor(public readonly statusCode: number, message: string, public readonly isOperational: boolean = false) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}