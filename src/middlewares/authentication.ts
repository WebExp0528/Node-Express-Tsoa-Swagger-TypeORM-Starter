import { IRequest } from '../types/general';
import { IUser } from '../types/user';
import { UserService } from '../services/userService';

export async function expressAuthentication(
  request: IRequest,
  securityName: string,
  scopes?: string[]
): Promise<IUser> {
  if (securityName === 'basic' && request.headers.authorization) {
    const email = request.headers.authorization;
    const user = await new UserService().getByEmail(email);
    const result = user ? Promise.resolve(user) : Promise.reject({});
    request.user = user;
    return result;
  }

  return Promise.reject({});
}

export default expressAuthentication;
