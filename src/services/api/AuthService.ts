import * as jose from 'jose';
import sha256 from 'sha256';
import { User } from '@/types/User';

export const secret = new TextEncoder().encode(
  'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
);
export const alg = 'HS256';
export const salt = '1c5fdc2e361a108ac35fa6b3fcaabd2d96fb45ececd2d8127b0eb025cb188370';

export class AuthService {
  static createToken = async (user: User) => String(
    await new jose.SignJWT({ ...user })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret),
  );

  static hashPassword = async (password: string) => sha256(password + salt);

  static verifyToken = async (token: string) => {
    try {
      await jose.jwtVerify(token, secret);
      return true;
    } catch (error) {
      return false;
    }
  };
}
