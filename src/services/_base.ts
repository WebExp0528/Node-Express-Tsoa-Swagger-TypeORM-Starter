import { BaseRepository } from './../database/repositories/_base';
import { IBaseEntity } from './../types/baseEntity';
import { IGetAllParams } from './../types/baseService';
import { OperationError } from '../common/operationError';
import { HttpStatusCode } from '../common/httpStatusCode';

export abstract class BaseService<
  IRepository extends BaseRepository<any, any, any> = any,
  IModel extends IBaseEntity = any
> {
  repository: IRepository;

  constructor(repo: IRepository) {
    this.repository = repo;
  }

  public async getById(id: number): Promise<IModel> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!result) {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }

    return result;
  }

  public async getAll({ page, pageSize }: IGetAllParams): Promise<Array<IModel>> {
    const take = pageSize;
    const skip = take && page && (page - 1) * take;

    return await this.repository.find({
      take,
      skip,
      order: {
        id: 'ASC',
      },
    });
  }

  public async delete(id: number): Promise<number> {
    const result = await this.getById(id);
    await this.repository.delete({
      id: result.id as any,
    });
    return id;
  }
}
