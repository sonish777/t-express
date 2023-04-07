import { Request, Response } from 'express';
import { BaseController, Controller, ProtectedRoute } from 'core/controllers';
import { HTTPMethods } from 'core/utils';

@Controller('/home')
export class HomeController extends BaseController {
    _title = 'Home';
    _viewPath = 'home';
    _module = 'home';

    @ProtectedRoute({
        path: '/',
        method: HTTPMethods.Get,
    })
    index(req: Request, res: Response) {
        return this.render(res);
    }
}
