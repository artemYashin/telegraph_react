import mysql, { MysqlError, OkPacket } from 'mysql';

const dbQuery = (query: string, callback: Function) => {
  const connection: mysql.Connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'artemyashindb',
  });

  connection.connect((err) => {
    if (err) {
      console.log(err);
    }
  });

  connection.query('CREATE DATABASE IF NOT EXISTS telegraph', 'telegraph', (err: any) => {
    if (err) {
      console.log('error in creating database', err);
      return;
    }

    connection.changeUser({
      database: 'telegraph',
    }, (err2: any) => {
      if (err2) {
        console.log('error in changing database', err2);
      }
    });
  });

  connection.changeUser({
    database: 'telegraph',
  }, (err2: any) => {
    if (err2) {
      console.log('error in changing database', err2);
    }
  });

  connection.query(query, (err: MysqlError, result: OkPacket) => {
    callback(err, result);
    connection.end();
  });
};

export default dbQuery;
