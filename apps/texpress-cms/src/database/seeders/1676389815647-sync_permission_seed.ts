import { CMSModulesConfig } from '@cms/configs';
import { PermissionEntity, RoleEntity } from 'shared/entities';
import { DeepPartial, MigrationInterface, QueryRunner } from 'typeorm';

export class syncPermissionSeed1676389815647 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissionsRepository =
            queryRunner.manager.getRepository(PermissionEntity);
        const roleRepository = queryRunner.manager.getRepository(RoleEntity);
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(PermissionEntity).delete({});
    }
}
