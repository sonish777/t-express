import { ApiUserEntity, UserEntity } from 'shared/entities';

export {};

declare global {
    namespace Express {
        interface User extends Partial<UserEntity & ApiUserEntity> {
            id: number;
            _id: string;
        }
    }
}
