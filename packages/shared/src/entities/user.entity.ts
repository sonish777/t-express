import {
    Column,
    Entity,
    BeforeInsert,
    JoinTable,
    ManyToMany,
    AfterLoad,
    BeforeUpdate,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from '../connections';
import { RoleEntity } from './role.entity';

@Entity({
    name: 'users',
})
@SetRepository(postgresDataSource)
export class UserEntity extends BaseEntity {
    @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
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

    @Column()
    token: string;

    @Column()
    tokenExpiry: Date;

    @Column()
    avatar: string;

    @Column()
    thumbnail: string;

    currentPassword: string;

    @AfterLoad()
    _setCurrentPassword() {
        this.currentPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return;
        }
        if (this.password !== this.currentPassword) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(this.password, salt);
            this.salt = salt;
            this.password = hashedPassword;
        }
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
