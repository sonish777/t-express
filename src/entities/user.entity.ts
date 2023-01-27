import { Column, Entity, BeforeInsert } from "typeorm";
import {genSalt, hash} from 'bcrypt';
import { SetRepository } from "@core/decorators";
import { BaseEntity } from "@core/classes/entities/base.entity";
@Entity({
    name: "users"
})
@SetRepository()
export class UserEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    dob: Date;

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
}
