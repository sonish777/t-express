import { CMSModulesConfig } from '@configs';
import { PermissionEntity, RoleEntity } from 'shared/entities';
import { DataSource, DeepPartial } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class SyncPermissionsSeeder implements Seeder {
  async run(_factory: Factory, dataSource: DataSource): Promise<void> {
    const permissionsRepository = dataSource.getRepository(PermissionEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);
    await permissionsRepository.query(
      `TRUNCATE TABLE public.permissions RESTART IDENTITY CASCADE;`
    );
    const permissions: DeepPartial<PermissionEntity>[] = [];
    Object.values(CMSModulesConfig).forEach((module) => {
      module.permissions?.forEach((permission) => {
        permissions.push({
          module: module.name,
          name: permission.name,
          method: permission.method,
          action: permission.value,
          route: permission.route,
        });
      });
    });
    const syncedPermissions = await permissionsRepository.save(permissions);
    const superAdminRole = await roleRepository.findOne({
      where: { slug: 'super-admin' },
    });
    if (!superAdminRole) {
      return;
    }
    superAdminRole.permissions = syncedPermissions;
    await roleRepository.save(superAdminRole);
  }
}
