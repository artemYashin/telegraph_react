import mysql, { MysqlError, OkPacket } from 'mysql';

const dbQuery = (query: string, callback: Function) => {
  const connection: mysql.Connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'artemyashindb',
    database: 'artemyashindb',
  });

  connection.connect((err) => {
    if (err) {
      console.log(err);
    }
  });

  connection.query(query, (err: MysqlError, result: OkPacket) => {
    callback(err, result);
    connection.end();
  });
};

export default dbQuery;
