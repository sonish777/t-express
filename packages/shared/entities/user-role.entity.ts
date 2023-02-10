import { postgresDataSource } from '../connections';
import { BaseEntity, SetRepository } from 'core/entities';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'user_roles' })
@SetRepository(postgresDataSource)
export class UserRoleEntity extends BaseEntity {
  @Column()
  _id: string;

  @Column()
  userId: number;

  @Column()
  roleId: number;

  @OneToOne(() => RoleEntity)
  @JoinColumn({
    name: 'roleId',
    referencedColumnName: 'id',
  })
  role: RoleEntity;
}
