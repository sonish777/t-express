import { ControllerMetadataKeys } from "@core/utils";
import { Service } from "typedi";

export function Controller(basePath: string = ''): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(ControllerMetadataKeys.BASE_PATH, basePath, target);
        Service()(target);
    }
}
