import { IPermission } from './permission.interface';

export interface IRole {
    permissions: IPermission[];
}
