import Container from 'typedi';
import { postgresDataSource } from '@database/connections';

export function SetRepository(): ClassDecorator {
  return (target) => {
    Container.set(target.name, postgresDataSource.getRepository(target));
  };
}
