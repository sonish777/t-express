import { Route, ApiController, TypedBody } from 'core/controllers';
import { APIBaseController } from 'core/controllers';
import { HTTPMethods, validatePassword } from 'core/utils';
import { UnauthorizedException } from 'shared/exceptions';
import { AuthService } from '@api/services';
import { NextFunction, Response } from 'express';
import { Login } from './interfaces/login.interface';
import jwt from 'jsonwebtoken';
import config from 'config';
import { CreateApiUserValidator } from 'shared/validators';
import { CatchAsync } from 'core/exceptions';
import { CreateUserDto, VerifyOTPDto } from '@api/dtos';
import { VerifyOTPValidator } from '@api/validators';

@ApiController('/auth')
export class ApiAuthController extends APIBaseController {
    protected title = 'Auth';
    protected module = 'auth';

    constructor(private readonly authService: AuthService) {
        super();
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/register',
        validators: [CreateApiUserValidator],
    })
    @CatchAsync
    async register(req: TypedBody<CreateUserDto>, res: Response) {
        const user = await this.authService.register(req.body);
        return this.created(res, user);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/verify-otp',
        validators: [VerifyOTPValidator],
    })
    @CatchAsync
    async verifyOtp(req: TypedBody<VerifyOTPDto>, res: Response) {
        await this.authService.verifyOtp(req.body);
        return this.ok(res);
    }

    @Route({ method: HTTPMethods.Post, path: '/login' })
    @CatchAsync
    async login(req: TypedBody<Login>, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        const userExists = await this.authService.findUserForLogin(username);
        if (
            !userExists ||
            !(await validatePassword(password, userExists.password))
        ) {
            return next(new UnauthorizedException('Invalid email or password'));
        }
        const token = jwt.sign(
            { _id: userExists?._id },
            config.get<string>('jwt.secret'),
            {
                expiresIn: config.get('jwt.expiresIn'),
            }
        );
        return this.send(res, {
            message: 'Log in successful',
            token,
        });
    }
}
