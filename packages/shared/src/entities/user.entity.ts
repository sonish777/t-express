import { Column, Entity, BeforeInsert, JoinTable, ManyToMany } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from '../connections';
import { RoleEntity } from './role.entity';

@Entity({
    name: 'users',
})
@SetRepository(postgresDataSource)
export class UserEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    dob: string;

    @Column()
    gender: string;

    @Column()
    mobileNumber: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    status: string;

    @BeforeInsert()
    async hashPassword() {
        const salt = await genSalt(10);
        const hashedPassword = await hash(this.password, salt);
        this.salt = salt;
        this.password = hashedPassword;
    }

    @ManyToMany(() => RoleEntity)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'roleId',
            referencedColumnName: 'id',
        },
    })
    role: RoleEntity[];
}
