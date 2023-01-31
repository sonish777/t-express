import { HTTPMethods } from '@core/utils';
import { Validator } from '@core/validators';
import { Handler } from 'express';

export type RouteOptions = {
  method: HTTPMethods;
  path: string;
  middlewares?: Handler[];
  validators?: Validator[];
};

export type FallbackRouteOptions = {
  fallback: true;
};
