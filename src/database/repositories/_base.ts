import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from '../entities/_base';
import { getDbConnection } from '..';
import { PostgresError } from '../postgres/error';
import { IBaseEntity } from './../../types/baseEntity';

/**
 * The generic type arguments for BaseRepository seem a little convoluted,
 * but there's a strategy in mind. TypeORM uses classes and class decorators
 * to set up establish ORM models and model relations.
 *
 * By only accepting and producing the interface version of models, we can keep
 * the class models from propagating throughout the app and allows repositories
 * to run on pure data structures
 */
export abstract class BaseRepository<
  // Properties in an existing record
  Props extends IBaseEntity,
  // Class representing TypeORM model
  Class extends BaseEntity & Props,
  // Properties required to create this record
  CreateProps
> {
  constructor(private readonly classFn: new () => Class) {}

  public findOne(options: FindOneOptions<Class>): Promise<Props | undefined> {
    return this.execute((repo) => repo.findOne(options));
  }

  public find(options: FindManyOptions<Class>): Promise<Props[]> {
    return this.execute((repo) => repo.find(options));
  }

  public create(model: CreateProps): Promise<Props> {
    const now = new Date();

    return this.execute((repo) =>
      repo.save({
        ...model,
        created_at: now,
        updated_at: now,
      })
    );
  }

  public update(model: Props): Promise<Props> {
    return this.execute((repo) =>
      repo.save({
        ...model,
        updated_at: new Date(),
      } as CreateProps & Props)
    );
  }

  public async delete(options: FindConditions<Class>): Promise<void> {
    await this.execute((repo) => repo.delete(options));
  }

  private async execute<P>(fn: (repo: Repository<Class>) => Promise<P>) {
    try {
      const repo = await this.getRepository();
      return await fn(repo);
    } catch (err) {
      throw new PostgresError(err.message, err);
    }
  }

  private async getRepository(): Promise<Repository<Class>> {
    const connection = await getDbConnection();
    return connection.getRepository<Class>(this.classFn);
  }
}
