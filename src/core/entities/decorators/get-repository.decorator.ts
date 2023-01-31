import Container from 'typedi';
import { BaseEntity } from '../base.entity';

export function GetRepository(entity: ThisType<BaseEntity>): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    target[propertyKey] = Container.get((<any>entity).name);
    Object.defineProperty(target, propertyKey, {
      value: Container.get((<any>entity).name),
    });
    return target;
  };
}
