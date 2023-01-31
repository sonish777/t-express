import { Response } from 'express';
import path from 'path';

export abstract class BaseController {
  protected readonly _baseView: string = 'base';
  abstract _title: string;
  abstract _viewPath: string;
  abstract _module: string;
  protected page: string = 'index';

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

  render(res: Response, data: Object = {}) {
    return res.render(this._baseView, {
      title: this._title,
      page: path.join(this._viewPath, this.page),
      module: this._module,
      data,
    });
  }
}
