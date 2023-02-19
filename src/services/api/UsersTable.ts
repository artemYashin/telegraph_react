import { OkPacket } from 'mysql';
import dbQuery from '@/Database';
import { AuthService } from './AuthService';

export interface UserDb {
  id: number;
  rights: string;
  hash: string;
  password_updated_at: string;
}

export default class UsersTable {
  static async createTable() {
    return new Promise((resolve, reject) => {
      dbQuery(`
      CREATE TABLE IF NOT EXISTS users ( id INT NOT NULL AUTO_INCREMENT , rights VARCHAR(255) NOT NULL , hash VARCHAR(255) NOT NULL , password_updated_at BIGINT NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB;`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async createUser(rights: string, hash: string, password_updated_at: string) {
    return new Promise<OkPacket>((resolve, reject) => {
      dbQuery(`INSERT INTO users (rights, hash, password_updated_at) VALUES ('${rights}', '${hash}', '${password_updated_at}');`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async changePassword(rights: string, password: string) {
    const passwordHash = await AuthService.hashPassword(password);

    return new Promise((resolve, reject) => {
      dbQuery(`UPDATE users SET hash = '${passwordHash}', password_updated_at = '${Date.now()}' WHERE rights = '${rights}';`, async (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            const createResult: OkPacket = await
            UsersTable.createUser(rights, passwordHash, Date.now().toString());

            if (createResult.affectedRows >= 1) {
              resolve(createResult);
            } else {
              reject();
            }
          }
          resolve(result);
        }
      });
    });
  }

  static async findUserByRights(rights: string): Promise<UserDb[]> {
    return new Promise((resolve, reject) => {
      dbQuery(`SELECT * FROM users WHERE rights = '${rights}';`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<UserDb[]>result);
        }
      });
    });
  }

  static async findUser(password: string): Promise<UserDb[]> {
    const passwordHash = await AuthService.hashPassword(password);
    return new Promise((resolve, reject) => {
      dbQuery(`SELECT * FROM users WHERE hash = '${passwordHash}';`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<UserDb[]>result);
        }
      });
    });
  }
}
