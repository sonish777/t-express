import { BaseEntity } from '@core/entities';
import { Repository, FindOptionsWhere } from 'typeorm';

export class BaseService<K extends BaseEntity> {
  repository: Repository<K>;

  findAll(): Promise<K[]> {
    return this.repository.find();
  }

  findOne(where: FindOptionsWhere<K>): Promise<K | null> {
    return this.repository.findOne({
      where: {
        ...where,
      },
    });
  }
}
