import Container from 'typedi';
import { BaseEntity } from '../base.entity';

export function GetRepository(entity: ThisType<BaseEntity>): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        target[propertyKey] = Container.get(entity);
        Object.defineProperty(target, propertyKey, {
            value: Container.get(entity),
        });
        return target;
    };
}
