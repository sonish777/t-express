import { Service } from "typedi";
import { ControllerMetadataKeys } from "../utils";

export function Controller(basePath: string = ''): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(ControllerMetadataKeys.BASE_PATH, basePath, target);
        Service()(target);
    }
}