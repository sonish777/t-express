import { IRole } from './role.interface';

export interface IUser {
    userRole: IUserRole
}

interface IUserRole {
    role: IRole;
}