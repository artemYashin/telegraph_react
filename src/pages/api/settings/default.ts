import { NextApiRequest, NextApiResponse } from 'next';
import Setup from '@/db_setup';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  await Setup();
  setTimeout(() => {
    res.status(200).json({ text: 'success' });
  }, 1000);
}
