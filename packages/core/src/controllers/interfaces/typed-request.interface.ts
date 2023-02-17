import { UserEntity } from 'shared/entities';

export interface TypedRequest extends Request {
    user: UserEntity;
}
