import { NextFunction, Request, Response } from 'express';
import {
    ApiController,
    TypedBody,
    APIBaseController,
    APIProtectedRoute,
    TypedQuery,
    Route,
} from 'core/controllers';
import { HTTPMethods, HttpStatus } from 'core/utils';
import { ApiUserService } from '@api/services';
import { ApiUserEntity } from 'shared/entities';
import { HttpException, CatchAsync } from 'core/exceptions';
import { CommonSearchQueryDto, CreateUserDto } from 'shared/dtos';
import { CreateUserValidator } from 'shared/validators';
import {
    ApiBearerAuth,
    ApiBody,
    ApiMetadata,
    ApiParameter,
    ApiTag,
} from 'core/swagger';

@ApiController('/users')
@ApiTag('Users')
export class ApiUserController extends APIBaseController {
    protected title = 'Users';
    protected module = 'users';

    constructor(private readonly service: ApiUserService) {
        super();
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/' })
    @ApiBearerAuth()
    @ApiParameter({ in: 'query', schema: CommonSearchQueryDto })
    @CatchAsync
    async findAll(req: TypedQuery<CommonSearchQueryDto>, res: Response) {
        const data = await this.service.paginate({
            ...req.query,
        });
        return this.paginate<ApiUserEntity>(res, data);
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/:id' })
    @ApiBearerAuth()
    @ApiParameter({
        in: 'path',
        schema: [{ name: 'id', type: 'number', required: true }],
    })
    @CatchAsync
    async findById(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);
        const user = await this.service.findOne({ id });
        if (!user) {
            return next(
                new HttpException(
                    HttpStatus.NOT_FOUND,
                    'User was not found',
                    'NotFoundException',
                    true
                )
            );
        }
        return this.send(res, user);
    }

    @APIProtectedRoute({
        method: HTTPMethods.Post,
        path: '/',
        validators: [CreateUserValidator],
    })
    @ApiBody({
        schema: CreateUserDto,
    })
    async create(req: TypedBody<CreateUserDto>, res: Response) {
        res.json(req.body);
    }
}
