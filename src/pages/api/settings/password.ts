import { NextApiRequest, NextApiResponse } from 'next';
import UsersTable from '@/services/api/UsersTable';

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  UsersTable.changePassword(req.body.rights, req.body.password);
  res.status(200).json({});
}
