export class HttpException extends Error {
    constructor(protected readonly statusCode: number, message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}