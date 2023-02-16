import { NextApiRequest, NextApiResponse } from 'next/types';
import ArticlesTable from '@/services/api/ArticlesTable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { sortings } = req.body;
  ArticlesTable.changeSorts(sortings);
  res.status(200).json({});
}
