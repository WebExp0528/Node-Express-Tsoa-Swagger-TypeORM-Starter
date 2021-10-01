import { ICreateUserProps, IUser } from './../types/user';
import { BaseService } from './_base';
import { OperationError } from '../common/operationError';
import { HttpStatusCode } from '../common/httpStatusCode';
import { UserRepository } from '../database/repositories/user';
import { PostgresError } from './../database/postgres/error';
import { PostgresErrorCode } from './../database/postgres/errorCodes';

import { Optional } from './../types/general';
export class UserService extends BaseService<UserRepository, IUser> {
  constructor() {
    const repo = new UserRepository();
    super(repo);
  }

  public async getByEmail(email: string): Promise<IUser> {
    const result = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!result) {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }

    return result;
  }

  public async create(userInfo: ICreateUserProps): Promise<IUser> {
    try {
      return await this.repository.create({
        ...userInfo,
      });
    } catch (err) {
      throw new OperationError('UNKNOWN_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async update(email: string, updateData: Optional<Pick<IUser, 'name' | 'refresh_token'>>): Promise<IUser> {
    try {
      const user = await this.getByEmail(email);
      return await this.repository.update({
        ...user,
        ...updateData,
      });
    } catch (err) {
      this.checkForUniqueViolation(err);

      throw new OperationError('UNKNOWN_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  private checkForUniqueViolation(err: unknown) {
    const emailInUse = err instanceof PostgresError && err.code === PostgresErrorCode.UNIQUE_VIOLATION;
    if (emailInUse) {
      throw new OperationError('EMAIL_IN_USE', HttpStatusCode.BAD_REQUEST);
    }
  }
}
