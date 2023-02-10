import Container from 'typedi';
import { DataSource } from 'typeorm';

export function SetRepository(dataSource: DataSource): ClassDecorator {
    return (target) => {
        Container.set(target, dataSource.getRepository(target));
    };
}
