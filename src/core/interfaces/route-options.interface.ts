import { HTTPMethods } from "../utils/http-methods.util";

export interface RouteOptions {
    method: HTTPMethods;
    path: string;
    middlewares?: any[];
}
