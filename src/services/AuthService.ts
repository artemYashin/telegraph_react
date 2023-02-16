import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export type LoginStatus = {
  success: boolean;
  token?: string;
  error?: string;
};

export class AuthService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Timeout',
    });
  }

  login = (password: string) => new Promise((resolve) => {
    this.instance.post('/api/auth/login', {
      password,
    }).then((res) => {
      if (res.data.access_token !== undefined) {
        Cookies.set('user', res.data.access_token);
        resolve({ success: true, token: res.data.access_token });
      }
      resolve(false);
    });
  });
}

export const authService = new AuthService('');
