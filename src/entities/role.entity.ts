import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity, SetRepository } from '@core/entities';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'roles' })
@SetRepository()
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
