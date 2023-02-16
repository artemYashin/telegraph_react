import { OkPacket } from 'mysql';
import dbQuery from '@/Database';

export type Setting = {
  id?: number;
  name: string;
  value: string;
};

export default class SettingsTable {
  static async createTable() {
    return new Promise((resolve, reject) => {
      dbQuery(`
      CREATE TABLE IF NOT EXISTS settings ( id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL, PRIMARY KEY (id));`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async createSetting({ name, value }: Setting) {
    return new Promise<OkPacket>((resolve, reject) => {
      dbQuery(`INSERT INTO settings (name, value) VALUES ('${name}', '${value}');`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async changeSetting(setting: Setting) {
    return new Promise((resolve, reject) => {
      dbQuery(`UPDATE settings SET value = '${setting.value}' WHERE name = '${setting.name}';`, async (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            const createResult: OkPacket = await
            SettingsTable.createSetting(setting);

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

  static async findSetting(name: string): Promise<Setting> {
    return new Promise((resolve, reject) => {
      dbQuery(`SELECT * FROM settings WHERE name = '${name}';`, (err: any, result: any) => {
        if (result) {
          if (result.length !== 0) {
            resolve(<Setting>result[0]);
            return;
          }
        }
        reject(err);
      });
    });
  }
}
