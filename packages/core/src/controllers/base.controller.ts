import { Breadcrumb } from 'core/interfaces';
import { Response } from 'express';
import path from 'path';

export abstract class BaseController {
    protected readonly _baseView: string = 'base';
    abstract _title: string;
    abstract _viewPath: string;
    abstract _module: string;
    protected page = 'index';
    protected breadcrumbs: Breadcrumb[] = [];

    get title() {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get viewPath() {
        return this._viewPath;
    }

    set viewPath(value: string) {
        this._viewPath = value;
    }

    get baseView() {
        return this._baseView;
    }

    setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
        this.breadcrumbs = breadcrumbs;
    }

    render(res: Response, data: Object = {}) {
        const breadcrumbs = [...this.breadcrumbs];
        this.setBreadcrumbs([]);
        return res.render(this._baseView, {
            title: this._title,
            page: path.join(this._viewPath, this.page),
            module: this._module,
            breadcrumbs,
            data,
        });
    }
}
