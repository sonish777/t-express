import { Route, ApiController, TypedBody } from 'core/controllers';
import { APIBaseController } from 'core/controllers/api-base.controller';
import { HTTPMethods, validatePassword } from 'core/utils';
import { UnauthorizedException } from 'shared/exceptions';
import { AuthService } from '@services';
import { NextFunction, Response } from 'express';
import { Login } from './interfaces/login.interface';
import jwt from 'jsonwebtoken';

@ApiController('/auth')
export class ApiAuthController extends APIBaseController {
    protected title = 'Auth';
    protected module = 'auth';

    constructor(private readonly authService: AuthService) {
        super();
    }

    @Route({ method: HTTPMethods.Post, path: '/login' })
    async login(req: TypedBody<Login>, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        const userExists = await this.authService.findUserForLogin(username);
        if (
            !userExists ||
            !(await validatePassword(password, userExists.password))
        ) {
            return next(new UnauthorizedException('Invalid email or password'));
        }
        const token = jwt.sign({ _id: userExists?._id }, 'TESTTT!');
        return this.send(res, {
            message: 'Log in successful',
            token,
        });
    }
}
