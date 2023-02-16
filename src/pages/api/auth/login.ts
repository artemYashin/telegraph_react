import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/services/api/AuthService';
import UsersTable, { UserDb } from '@/services/api/UsersTable';
import SettingsTable from '@/services/api/SettingsTable';
import ArticlesTable from '@/services/api/ArticlesTable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  await SettingsTable.createTable();
  await UsersTable.createTable();
  await ArticlesTable.createTable();
  await UsersTable.changePassword('admin', 'admin');
  await SettingsTable.changeSetting({
    name: 'user_password_token',
    value: 'yes'
  });
  const { password } = req.body;

  const foundUsers: UserDb[] = await UsersTable.findUser(password);

  if (foundUsers.length === 0) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const user = foundUsers[0];

  const token = await AuthService.createToken({ admin: user.rights === 'admin', password_updated_at: user.password_updated_at });

  res.status(200).json({ access_token: token });
}
