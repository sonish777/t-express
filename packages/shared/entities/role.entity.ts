import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity, SetRepository } from 'core/entities';
import { PermissionEntity } from './permission.entity';
import { postgresDataSource } from '../connections';

@Entity({ name: 'roles' })
@SetRepository(postgresDataSource)
export class RoleEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @ManyToMany(() => PermissionEntity)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'roleId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permissionId',
            referencedColumnName: 'id',
        },
    })
    permissions: PermissionEntity[];
}
