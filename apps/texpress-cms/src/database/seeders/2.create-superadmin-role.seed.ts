import { RoleEntity } from 'shared/entities/role.entity';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class CreateSuperAdminRoleSeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource) {
    const superAdminRole = {
      name: 'Super Admin',
      slug: 'super-admin',
    };
    const rolesRepository = dataSource.getRepository(RoleEntity);
    const roleExists = await rolesRepository.findOne({
      where: { slug: superAdminRole.slug },
    });
    if (roleExists) {
      return;
    }
    await rolesRepository.save(superAdminRole);
  }
}
