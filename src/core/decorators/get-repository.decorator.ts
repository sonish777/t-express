import { BaseEntity } from "@core/classes/entities/base.entity";
import Container from "typedi";

export function GetRepository(entity: ThisType<BaseEntity>): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        target[propertyKey] = Container.get((<any>entity).name);
        Object.defineProperty(target, propertyKey, {
            value: Container.get((<any>entity).name)
        });
        return target;
    };
}
