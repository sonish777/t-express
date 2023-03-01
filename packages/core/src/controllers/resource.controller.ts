import _ from 'lodash';
import { BaseEntity } from 'core/entities';
import { Breadcrumb, CommonSearchQuery } from 'core/interfaces';
import { BaseService } from 'core/services';
import { HTTPMethods } from 'core/utils';
import { Validator } from 'core/validators';
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ProtectedRoute } from './decorators';
import { TypedQuery } from './interfaces/typed-query.interface';
import { TypedBody } from './interfaces';
import { CatchAsync } from 'core/exceptions';

export function ResourceControllerFactory<
    Model extends BaseEntity,
    Service extends BaseService<Model>
>(options: {
    resource: string;
    findRelations?: string[];
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
        public indexBreadcrumbs: Breadcrumb[] = [
            { name: _.capitalize(this._module), url: `/${this._module}` },
        ];
        public breadcrumbs: Breadcrumb[] = [];

        constructor(public readonly service: Service) {
            super();
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/',
        })
        @CatchAsync
        async index(req: TypedQuery<CommonSearchQuery>, res: Response) {
            this.page = 'index';
            this.setBreadcrumbs(this.indexBreadcrumbs);
            const data = await this.service.paginate(
                {
                    ...req.query,
                },
                options.findRelations
            );
            if (req.query.keywords) {
                req.flash('inputData', req.query.keywords);
            }
            return this.render(res, data);
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/create',
        })
        @CatchAsync
        create(_req: Request, res: Response) {
            this.page = 'create';
            this.setBreadcrumbs([
                ...this.indexBreadcrumbs,
                { name: 'Create', url: '#' },
            ]);
            return this.render(res);
        }

        @ProtectedRoute({
            method: HTTPMethods.Post,
            path: '/',
            validators: [...(options.validators?.create ?? [])],
        })
        @CatchAsync
        async add(req: Request, res: Response) {
            await this.service.create(req.body);
            req.flash(
                'message:toast',
                `${_.capitalize(options.resource)} created successfully`
            );
            return res.redirect('back');
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/:id',
        })
        @CatchAsync
        async edit(req: Request, res: Response) {
            const id = req.params.id;
            this.page = 'edit';
            this.setBreadcrumbs([
                ...this.indexBreadcrumbs,
                { name: 'Edit', url: '#' },
            ]);
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
        @CatchAsync
        async update(req: TypedBody<any>, res: Response) {
            const body = req.body;
            const id = req.params.id;
            await this.service.update(Number(id), body);
            req.flash(
                'message:toast',
                `${_.capitalize(options.resource)} updated successfully`
            );
            return res.redirect('back');
        }

        @ProtectedRoute({
            method: HTTPMethods.Delete,
            path: '/:id',
        })
        @CatchAsync
        async delete(req: Request, res: Response) {
            const id = req.params.id;
            await this.service.delete(Number(id));
            req.flash(
                'message:toast',
                `${_.capitalize(options.resource)} deleted successfully`
            );
            return res.redirect('back');
        }
    }

    return ResourceController;
}
