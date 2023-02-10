import _ from 'lodash';
import { BaseEntity } from 'core/entities';
import { CommonSearchQuery } from 'core/interfaces';
import { BaseService } from 'core/services';
import { HTTPMethods } from 'core/utils';
import { Validator } from 'core/validators';
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ProtectedRoute } from './decorators';
import { TypedQuery } from './interfaces/typed-query.interface';

export function ResourceControllerFactory<
    Model extends BaseEntity,
    Service extends BaseService<Model>
>(options: {
    resource: string;
    validators?: {
        create?: Validator[];
        update?: Validator[];
    };
}) {
    abstract class ResourceController extends BaseController {
        public readonly _baseView: string = 'base';
        public page = 'index';
        public readonly _module: string = options.resource;
        public abstract _title: string;
        public abstract _viewPath: string;

        constructor(public readonly service: Service) {
            super();
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/',
        })
        async index(req: TypedQuery<CommonSearchQuery>, res: Response) {
            this.page = 'index';
            const data = await this.service.paginate({
                ...req.query,
            });
            return this.render(res, data);
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/create',
        })
        create(_req: Request, res: Response) {
            this.page = 'create';
            return this.render(res);
        }

        @ProtectedRoute({
            method: HTTPMethods.Post,
            path: '/',
            validators: [...(options.validators?.create ?? [])],
        })
        async add(req: Request, res: Response) {
            await this.service.create(req.body);
            req.flash(
                'message',
                `${_.capitalize(options.resource)} created successfully`
            );
            return res.redirect('back');
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/:id',
        })
        async edit(req: Request, res: Response) {
            this.page = 'edit';
            const id = req.params.id;
            const user = await this.service.findOne({ id: <any>Number(id) });
            if (!user) {
                req.flash(
                    'error',
                    `${_.capitalize(options.resource)} not found`
                );
                return res.redirect('back');
            }
            return this.render(res, user);
        }

        @ProtectedRoute({
            method: HTTPMethods.Put,
            path: '/:id',
            validators: [...(options.validators?.update ?? [])],
        })
        async update(req: Request, res: Response) {
            const body = req.body;
            const id = req.params.id;
            await this.service.update(Number(id), body);
            req.flash(
                'message',
                `${_.capitalize(options.resource)} updated successfully`
            );
            return res.redirect('back');
        }

        @ProtectedRoute({
            method: HTTPMethods.Delete,
            path: '/:id',
        })
        async delete(req: Request, res: Response) {
            const id = req.params.id;
            await this.service.delete(Number(id));
            req.flash(
                'message',
                `${_.capitalize(options.resource)} deleted successfully`
            );
            return res.redirect('back');
        }
    }

    return ResourceController;
}
