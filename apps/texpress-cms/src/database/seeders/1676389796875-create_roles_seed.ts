import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleEntity } from 'shared/entities';

export class createRolesSeed1676389796875 implements MigrationInterface {
    superAdminRole = {
        name: 'Super Admin',
        slug: 'super-admin',
    };

    public async up(queryRunner: QueryRunner): Promise<void> {
        const rolesRepository = queryRunner.manager.getRepository(RoleEntity);
        const roleExists = await rolesRepository.findOne({
            where: { slug: this.superAdminRole.slug },
        });
        if (roleExists) {
            return;
        }
        await rolesRepository.save(this.superAdminRole);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(RoleEntity).delete({
            slug: this.superAdminRole.slug,
        });
    }
}
