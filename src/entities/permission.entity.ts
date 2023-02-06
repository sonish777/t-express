import { BaseEntity, SetRepository } from '@core/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'permissions' })
@SetRepository()
export class PermissionEntity extends BaseEntity {
  @Column()
  _id: string;

  @Column()
  name: string;

  @Column()
  route: string;

  @Column()
  method: string;

  @Column()
  action: string;
}
