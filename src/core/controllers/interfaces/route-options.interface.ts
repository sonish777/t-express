import { HTTPMethods } from '@core/utils';
import { Validator } from '@core/validators';
import { Handler } from 'express';

export interface RouteOptions {
  method: HTTPMethods;
  path: string;
  middlewares?: Handler[];
  validators?: Validator[];
}

export interface FallbackRouteOptions {
  fallback: true;
}
