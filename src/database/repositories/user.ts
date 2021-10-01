import { IUser, ICreateUserProps } from './../../types/user';
import { UserEntity } from '../entities/user';
import { BaseRepository } from './_base';

export class UserRepository extends BaseRepository<IUser, UserEntity, ICreateUserProps> {
  constructor() {
    super(UserEntity);
  }
}
