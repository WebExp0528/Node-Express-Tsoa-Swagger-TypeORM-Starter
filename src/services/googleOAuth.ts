import { google, people_v1 } from 'googleapis';
import { IToken } from '../types/auth';
import { IUser } from '../types/user';
import { UserService } from './userService';
import _ from 'lodash';
import { IContacts } from '../types/contacts';

export class GoogleOAuth {
  static clientId = process.env.CLIENT_ID;
  static clientSecret = process.env.CLIENT_SECRET;
  static redirectURI = process.env.REDIRECT_URI;

  email = '';
  peopleClient: people_v1.People | undefined;
  oAuthClient;
  tokens: IToken = {};

  static scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/contacts.readonly',
  ];

  constructor() {
    this.oAuthClient = new google.auth.OAuth2(GoogleOAuth.clientId, GoogleOAuth.clientSecret, GoogleOAuth.redirectURI);
  }

  onChangedTokens = (tokens: IToken): void => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      const userService = new UserService();
      userService.update(this.email, { refresh_token: tokens.refresh_token });
    }
    this.tokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  };

  getOAuthUri = (state?: string): string => {
    return this.oAuthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GoogleOAuth.scopes,
      state: state,
    });
  };

  getOAuthTokenFromCode = async (authorizationCode: string): Promise<IToken> => {
    const res = await this.oAuthClient.getToken(authorizationCode);
    if (!res.tokens) {
      return this.tokens;
    }
    this.tokens = {
      access_token: res?.tokens?.access_token || '',
      refresh_token: res?.tokens?.refresh_token || '',
    };

    return this.tokens;
  };

  setToken = (token: IToken, email = ''): void => {
    this.email = email;
    this.oAuthClient.setCredentials(token);
    this.oAuthClient.on('tokens', this.onChangedTokens);
    this.peopleClient = google.people({
      version: 'v1',
      auth: this.oAuthClient,
    });
  };

  getUser = async (): Promise<Pick<IUser, 'name' | 'email'>> => {
    const { data } =
      (await this.peopleClient?.people.get({ resourceName: 'people/me', personFields: 'emailAddresses,names' })) || {};
    return { name: _.get(data, 'names[0].displayName', ''), email: _.get(data, 'emailAddresses[0].value', '') };
  };

  getContacts = async (): Promise<IContacts[]> => {
    const { data } =
      (await this.peopleClient?.people.connections.list({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names',
      })) || {};

    return _.get(data, 'connections', []).map((el): IContacts => {
      return { name: _.get(el, 'names[0].displayName'), email: _.get(el, 'emailAddresses[0].value') };
    });
  };
}
