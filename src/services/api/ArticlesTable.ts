import { OkPacket } from 'mysql';
import dbQuery from '@/Database';
import { Article } from '@/types/Article';

export interface ArticleOrder {
  id: number;
  sort: number;
}

export default class ArticlesTable {
  static async createTable() {
    return new Promise((resolve, reject) => {
      dbQuery(`
      CREATE TABLE IF NOT EXISTS articles (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sort int NOT NULL DEFAULT '0',
        title text NOT NULL,
        body text NOT NULL
      );`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getArticles() {
    return new Promise<Article[]>((resolve, reject) => {
      dbQuery('SELECT id, title, sort FROM articles ORDER BY sort ASC;', (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async deleteArticle(id: number) {
    return new Promise<OkPacket>((resolve, reject) => {
      dbQuery(`DELETE FROM articles WHERE id = ${id};`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async updateArticle(id: number, title: string, body: string) {
    const newBody = body.replaceAll('\\n', '\\\\n');
    return new Promise<OkPacket>((resolve, reject) => {
      dbQuery(`UPDATE articles SET title = '${title}', body = '${newBody}' WHERE id = ${id};`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getArticle(id: number) {
    return new Promise<Article>((resolve, reject) => {
      dbQuery(`SELECT * FROM articles WHERE id = ${id};`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });
  }

  static async changeSorts(sort: ArticleOrder[]) {
    const sortings = sort.map((article) => `(${article.id}, ${article.sort})`).join(',');
    return new Promise((resolve, reject) => {
      dbQuery(`INSERT INTO articles (id, sort) VALUES ${sortings} ON DUPLICATE KEY UPDATE sort = VALUES(sort)`, async (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            reject();
          }
          resolve(result);
        }
      });
    });
  }

  static async createArticle(title: string, body: string) {
    const newBody = body.replaceAll('\\n', '\\\\n');
    return new Promise<OkPacket>((resolve, reject) => {
      dbQuery(`INSERT INTO articles (title, body) VALUES ('${title}', '${newBody}');`, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
