/*
 * Default database setup
 */
import UsersTable from './services/api/UsersTable';
import SettingsTable from './services/api/SettingsTable';
import ArticlesTable from './services/api/ArticlesTable';
import dbQuery from './Database';

export default async function Setup() {
  await (new Promise<void>((resolve) => {
    dbQuery('CREATE DATABASE IF NOT EXISTS telegraph', (err: any) => {
      if (err) {
        console.log(err);
      }
      console.log('done');
      resolve();
    });
  }));

  await UsersTable.createTable();
  await SettingsTable.createTable();
  await ArticlesTable.createTable();
  await UsersTable.findUserByRights('admin').then((user) => {
    if (user.length === 0) {
      UsersTable.changePassword('admin', 'admin');
      UsersTable.changePassword('user', 'user');
    }
  }).catch(() => {
    UsersTable.changePassword('admin', 'admin');
    UsersTable.changePassword('user', 'user');
  });
  await SettingsTable.findSetting('user_password_state').then((setting: any) => {
    if (setting.length === 0) {
      SettingsTable.changeSetting({ name: 'user_password_state', value: 'yes' });
    }
  }).catch(() => {
    SettingsTable.changeSetting({ name: 'user_password_state', value: 'yes' });
  });
}
