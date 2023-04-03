import {
    Route,
    ApiController,
    TypedBody,
    APIProtectedRoute,
    APIBaseController,
    TypedQuery,
    ProtectedRequest,
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
import { CreateApiUserValidator } from 'shared/validators';
import {
    CreateUserDto,
    RefreshTokenDto,
    VerifyOTPDto,
    SocialLoginDto,
} from '@api/dtos';
import {
    RefreshTokenValidator,
    SetPasswordValidator,
    VerifyOTPValidator,
    ForgotPasswordValidator,
    SocialLoginValidator,
} from '@api/validators';
import { ForgotPasswordDto, LoginDto, SetPasswordDto } from 'shared/dtos';
import { PaginationOptions, PaginationResponse } from 'core/interfaces';
import { ApiUserEntity } from 'shared/entities';
import { Log } from '@api/logger';
import { Throttle } from 'shared/services';
import { ApiBody, ApiTag, ApiBearerAuth, ApiResponse } from 'core/swagger';
import { Tokens } from '@api/schemas';
import { ConsoleLogger } from 'shared/logger';

@ApiController('/auth')
@ApiTag('Authentication')
export class ApiAuthController extends APIBaseController {
    protected title = 'Auth';
    protected module = 'auth';

    constructor(
        private readonly authService: AuthService,
        private readonly logger: ConsoleLogger
    ) {
        super();
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/register',
        validators: [CreateApiUserValidator],
    })
    @RespondCreated(true)
    @ApiBody({ schema: CreateUserDto })
    register(req: TypedBody<CreateUserDto>) {
        return this.authService.register(req.body);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/verify-otp',
        validators: [VerifyOTPValidator],
    })
    @ApiBody({ schema: VerifyOTPDto })
    @ApiResponse({
        contentType: 'text/plain',
        schema: { type: 'string', example: 'OK' },
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
    @ApiBody({ schema: SetPasswordDto })
    @RespondItem()
    setPassword(req: TypedBody<SetPasswordDto>) {
        return this.authService.setPassword(req.body);
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/profile' })
    @ApiBearerAuth()
    @RespondItem()
    profile(req: ProtectedRequest) {
        return this.authService.getProfile(req.user.id);
    }

    @Route({ method: HTTPMethods.Post, path: '/login' })
    @ApiBody({ schema: LoginDto })
    @ApiResponse({ schema: Tokens })
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
    @ApiBody({ schema: RefreshTokenDto })
    async logout(req: TypedBody<RefreshTokenDto>) {
        try {
            if (req.body.refreshToken) {
                await this.authService.logout(req.body);
            }
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/refresh',
        validators: [RefreshTokenValidator],
    })
    @ApiBody({ schema: RefreshTokenDto })
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
    @ApiBody({ schema: ForgotPasswordDto })
    forgotPassword(req: TypedBody<ForgotPasswordDto>) {
        return this.authService.forgotPassword(req.body);
    }

    @Route({ method: HTTPMethods.Get, path: '/all-users' })
    @RespondPaginated()
    findAll(
        req: TypedQuery<PaginationOptions>
    ): Promise<PaginationResponse<ApiUserEntity>> {
        return this.authService.paginate(req.query);
    }

    @Route({
        method: HTTPMethods.Post,
        path: '/social-login',
        validators: [SocialLoginValidator],
    })
    @ApiBody({ schema: SocialLoginDto })
    @RespondItem()
    socialLogin(req: TypedBody<SocialLoginDto>) {
        return this.authService.socialLogin(req.body);
    }
}
