import { NextApiRequest, NextApiResponse } from 'next';
import SettingsTable from '@/services/api/SettingsTable';

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  await SettingsTable.changeSetting({ name: 'user_password_state', value: req.body.passwordState });
  res.status(200).json({});
}
