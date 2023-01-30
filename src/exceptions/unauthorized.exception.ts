import { HttpException } from "@core/exceptions";

export class UnauthorizedException extends HttpException {
    constructor(message: string = "You are not authorized") {
        super(401, message, true);
    }
}
