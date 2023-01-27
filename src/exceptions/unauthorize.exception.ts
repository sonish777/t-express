import { HttpException } from "@core/classes/exceptions/http.exception";

export class UnauthorizedException extends HttpException {
    constructor(message: string = "You are not authorized") {
        super(401, message);
    }
}
