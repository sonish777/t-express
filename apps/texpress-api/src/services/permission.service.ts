import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { PermissionEntity } from 'shared/entities';
import { Service } from 'typedi';
import { In, Repository } from 'typeorm';

export interface ModulePermissions {
  module: string;
  permissions: PermissionEntity[];
}

@Service()
export class PermissionService extends BaseService<PermissionEntity> {
  @GetRepository(PermissionEntity)
  protected readonly repository: Repository<PermissionEntity>;

  getModulePermissions(): Promise<ModulePermissions[]> {
    const qb = this.repository.createQueryBuilder('table');
    qb.select(
      '"table"."module" as module, array_to_json(array_agg("table".*)) as permissions'
    ).groupBy('"table"."module"');
    return qb.getRawMany<ModulePermissions>();
  }

  getPermissionInIds(ids: number[]): Promise<PermissionEntity[]> {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
