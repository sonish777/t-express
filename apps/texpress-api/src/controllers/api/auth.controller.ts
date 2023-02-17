import {
    Route,
    ApiController,
    TypedBody,
    APIProtectedRoute,
} from 'core/controllers';
import { APIBaseController } from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { AuthService } from '@api/services';
import { Request, Response } from 'express';
import { CreateApiUserValidator } from 'shared/validators';
import { CatchAsync } from 'core/exceptions';
import { CreateUserDto, RefreshTokenDto, VerifyOTPDto } from '@api/dtos';
import {
    RefreshTokenValidator,
    SetPasswordValidator,
    VerifyOTPValidator,
} from '@api/validators';
import { LoginDto, SetPasswordDto } from 'shared/dtos';

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
        const tokens = await this.authService.verifyOtp(req.body);
        return this.send(res, tokens);
    }

    @APIProtectedRoute({
        method: HTTPMethods.Post,
        path: '/set-password',
        validators: [SetPasswordValidator],
    })
    @CatchAsync
    async setPassword(req: TypedBody<SetPasswordDto>, res: Response) {
        await this.authService.setPassword(req.user!.id, req.body);
        return this.ok(res);
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/profile' })
    @CatchAsync
    async profile(req: Request, res: Response) {
        const user = await this.authService.getProfile(req.user!.id);
        this.send(res, user);
    }

    @Route({ method: HTTPMethods.Post, path: '/login' })
    @CatchAsync
    async login(req: TypedBody<LoginDto>, res: Response) {
        const { username, password } = req.body;
        const tokens = await this.authService.login(username, password);
        return this.send(res, tokens);
    }

    @Route({ method: HTTPMethods.Post, path: '/logout' })
    @CatchAsync
    async logout(req: TypedBody<RefreshTokenDto>, res: Response) {
        if (req.body.refreshToken) {
            this.authService.logout(req.body).catch(console.log);
        }
        return this.deleted(res);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/refresh',
        validators: [RefreshTokenValidator],
    })
    @CatchAsync
    async refresh(req: TypedBody<RefreshTokenDto>, res: Response) {
        const accessToken =
            await this.authService.getAccessTokenFromRefreshToken(req.body);
        this.send(res, accessToken);
    }
}
