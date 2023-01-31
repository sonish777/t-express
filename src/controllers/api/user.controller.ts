import { Request, Response } from 'express';
import { ApiController, Route } from '@core/controllers';
import { HTTPMethods } from '@core/utils';
import { UserService } from '@services';

@ApiController('/users')
export class ApiUserController {
  constructor(private readonly service: UserService) {}

  @Route({
    method: HTTPMethods.Get,
    path: '/',
  })
  async findAll(req: Request, res: Response) {
    const data = await this.service.findAll();
    return res.status(200).json({
      status: 'OK',
      data,
    });
  }
}
