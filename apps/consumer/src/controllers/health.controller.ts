import { Controller, Route } from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { Request, Response } from 'express';

@Controller('/healthz')
export class HealthController {
    @Route({ method: HTTPMethods.Get, path: '/' })
    async getHealth(req: Request, res: Response) {
        return res.status(200).json({
            status: 'Running',
            code: 200,
        });
    }
}
