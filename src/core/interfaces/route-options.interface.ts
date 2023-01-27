import { HTTPMethods } from "@core/utils";
import { Handler } from "express";

export interface RouteOptions {
    method: HTTPMethods;
    path: string;
    middlewares?: Handler[];
}
