import { NextFunction, Request, Response } from 'express';
import {
    ApiController,
    TypedBody,
    APIBaseController,
    APIProtectedRoute,
    TypedQuery,
} from 'core/controllers';
import { HTTPMethods, HttpStatus } from 'core/utils';
import { ApiUserService } from '@api/services';
import { ApiUserEntity } from 'shared/entities';
import { CommonSearchQuery } from 'core/interfaces';
import { HttpException, CatchAsync } from 'core/exceptions';
import { CreateUser } from 'shared/dtos';
import { CreateUserValidator } from 'shared/validators';

@ApiController('/users')
export class ApiUserController extends APIBaseController {
    protected title = 'Users';
    protected module = 'users';

    constructor(private readonly service: ApiUserService) {
        super();
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/' })
    @CatchAsync
    async findAll(req: TypedQuery<CommonSearchQuery>, res: Response) {
        const data = await this.service.paginate({
            ...req.query,
        });
        return this.paginate<ApiUserEntity>(res, data);
    }

    @APIProtectedRoute({ method: HTTPMethods.Get, path: '/:id' })
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
    async create(req: TypedBody<CreateUser>, res: Response) {
        res.json(req.body);
    }
}
