import { BaseEntity, SetRepository } from 'core/entities';
import { AfterLoad, BeforeUpdate, Column, Entity } from 'typeorm';
import { postgresDataSource } from '../connections/postgres';
import { genSalt, hash } from 'bcrypt';
import { Exclude, Transform } from 'class-transformer';
import moment from 'moment';

@Entity({ name: 'api_users' })
@SetRepository(postgresDataSource)
export class ApiUserEntity extends BaseEntity {
    @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
    _id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    gender: string;

    @Column()
    @Transform(
        ({ value }) => moment(value, 'YYYY/MM/DD').format('YYYY/MM/DD'),
        {
            toPlainOnly: true,
        }
    )
    dob: string;

    @Column()
    mobileNumber: string;

    @Column()
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    salt: string;

    @Column()
    status: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    token: string;

    @Column()
    socialType: string;

    @Column()
    socialToken: string;

    @Column()
    tokenVerified: boolean;

    @Column()
    @Exclude({ toPlainOnly: true })
    tokenExpiry: Date;

    @Exclude({ toPlainOnly: true })
    currentPassword: string;

    @AfterLoad()
    _setCurrentPassword() {
        this.currentPassword = this.password;
    }

    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return;
        }
        if (this.currentPassword !== this.password) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(this.password, salt);
            this.salt = salt;
            this.password = hashedPassword;
        }
    }
}
