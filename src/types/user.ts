import { IBaseEntity } from './baseEntity';

export interface IUser extends IBaseEntity {
  email: string;
  name: string;
  refresh_token: string;
}

export type ICreateUserProps = Pick<IUser, 'email' | 'name' | 'refresh_token'>;

export interface IUserCreateReq {
  authorization_code: string;
}

export type IGetUserRes = Pick<IUser, 'id' | 'email' | 'name' | 'created_at' | 'updated_at'>;
