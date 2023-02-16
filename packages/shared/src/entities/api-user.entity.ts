import { BaseEntity, SetRepository } from 'core/entities';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { postgresDataSource } from '../connections/postgres';
import { genSalt, hash } from 'bcrypt';

@Entity({ name: 'api_users' })
@SetRepository(postgresDataSource)
export class ApiUserEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    gender: string;

    @Column()
    dob: string;

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

    @BeforeInsert()
    async hashPassword() {
        const salt = await genSalt(10);
        const hashedPassword = await hash(this.password, salt);
        this.salt = salt;
        this.password = hashedPassword;
    }
}
