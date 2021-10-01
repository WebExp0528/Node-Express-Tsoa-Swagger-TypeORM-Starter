import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { IBaseEntity } from './../../types/baseEntity';

export class BaseEntity implements IBaseEntity {
  /**
   * Unique Identifier
   */
  @PrimaryGeneratedColumn()
  public id!: number;

  /**
   * Date of creation
   */
  @Column('timestamp')
  public created_at!: Date;

  /**
   * Date of update
   */
  @Column('timestamp')
  public updated_at!: Date;
}
