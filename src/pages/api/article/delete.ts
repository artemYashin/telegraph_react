import type { NextApiRequest, NextApiResponse } from 'next';
import ArticlesTable from '@/services/api/ArticlesTable';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  const id: number = Number(req.body?.id);
  ArticlesTable.deleteArticle(id);
  res.status(200).json({});
}
