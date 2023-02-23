import {
    Route,
    ApiController,
    TypedBody,
    APIProtectedRoute,
    APIBaseController,
    TypedQuery,
} from 'core/controllers';
import {
    RespondCreated,
    RespondDeleted,
    HTTPMethods,
    RespondOK,
    RespondPaginated,
    RespondItem,
} from 'core/utils';
import { AuthService } from '@api/services';
import { Request } from 'express';
import { CreateApiUserValidator } from 'shared/validators';
import { CreateUserDto, RefreshTokenDto, VerifyOTPDto } from '@api/dtos';
import {
    RefreshTokenValidator,
    SetPasswordValidator,
    VerifyOTPValidator,
    ForgotPasswordValidator,
} from '@api/validators';
import { LoginDto, SetPasswordDto } from 'shared/dtos';
import { PaginationOptions, PaginationResponse } from 'core/interfaces';
import { ApiUserEntity } from 'shared/entities';
import { Log } from '@api/logger';
import { Throttle } from 'shared/services';

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
    @RespondCreated(true)
    register(req: TypedBody<CreateUserDto>) {
        return this.authService.register(req.body);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/verify-otp',
        validators: [VerifyOTPValidator],
    })
    @RespondOK()
    verifyOtp(req: TypedBody<VerifyOTPDto>) {
        return this.authService.verifyOtp(req.body);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/set-password',
        validators: [SetPasswordValidator],
    })
    @RespondItem()
    setPassword(req: TypedBody<SetPasswordDto>) {
        return this.authService.setPassword(req.body);
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/profile' })
    @RespondItem()
    profile(req: Request) {
        return this.authService.getProfile(req.user!.id);
    }

    @Route({ method: HTTPMethods.Post, path: '/login' })
    @RespondItem()
    @Log()
    @Throttle<ApiAuthController, 'login'>((req) => `login:throttle_${req.ip}`, {
        attempts: 2,
        blockDuration: 20,
    })
    async login(req: TypedBody<LoginDto>) {
        const { username, password } = req.body;
        return this.authService.login(username, password);
    }

    @Route({ method: HTTPMethods.Post, path: '/logout' })
    @RespondDeleted()
    logout(req: TypedBody<RefreshTokenDto>) {
        if (req.body.refreshToken) {
            this.authService.logout(req.body).catch(console.log);
        }
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/refresh',
        validators: [RefreshTokenValidator],
    })
    @RespondItem()
    async refresh(req: TypedBody<RefreshTokenDto>) {
        return this.authService.getAccessTokenFromRefreshToken(req.body);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/forgot-password',
        validators: [ForgotPasswordValidator],
    })
    @RespondOK('Check your email to reset your password')
    forgotPassword(req: TypedBody<Pick<LoginDto, 'username'>>) {
        return this.authService.forgotPassword(req.body);
    }

    @Route({ method: HTTPMethods.Get, path: '/all-users' })
    @RespondPaginated()
    findAll(
        req: TypedQuery<PaginationOptions>
    ): Promise<PaginationResponse<ApiUserEntity>> {
        return this.authService.paginate(req.query);
    }
}
