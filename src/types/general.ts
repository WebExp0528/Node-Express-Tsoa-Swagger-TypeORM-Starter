import { Request } from 'express';
import { IUser } from './user';
export type Optional<T> = { [P in keyof T]?: T[P] };

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IRequest extends Request {
  user: IUser;
}
