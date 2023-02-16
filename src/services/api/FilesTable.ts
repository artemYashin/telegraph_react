import { OkPacket } from 'mysql';
import dbQuery from '@/Database';

export interface FileDb {
  id: number;
  path: string;
  name: string;
}

export default class FilesTable {
  static async createTable() {
    return new Promise((resolve, reject) => {
      dbQuery(`
      CREATE TABLE IF NOT EXISTS files ( id INT NOT NULL AUTO_INCREMENT , path VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB;`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async createFile(path: string, name: string) {
    return new Promise<OkPacket>((resolve, reject) => {
      dbQuery(`INSERT INTO files (path, name) VALUES ('${path}', '${name}');`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
