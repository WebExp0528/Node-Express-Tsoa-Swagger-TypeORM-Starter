import { Column, Entity } from 'typeorm';
import { IUser } from './../../types/user';
import { BaseEntity } from './_base';

@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
  @Column({
    nullable: false,
    type: 'text',
    unique: true,
  })
  public email!: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  public name!: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  refresh_token!: string;
}
