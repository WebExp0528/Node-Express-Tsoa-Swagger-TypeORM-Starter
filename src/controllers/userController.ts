import { Controller, Get, Route, Security, Request } from 'tsoa';
import { IRequest } from './../types/general';
import { IGetUserRes } from './../types/user';
// import { UserService } from '../services/userService';

@Security('basic')
@Route('users')
export class UsersController extends Controller {
  /**
   * Returns user info
   * @param request
   * @returns
   */
  @Get('info')
  public async getUser(@Request() request: IRequest): Promise<IGetUserRes> {
    const user = request.user;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      updated_at: user.updated_at,
      created_at: user.created_at,
    };
  }
}
