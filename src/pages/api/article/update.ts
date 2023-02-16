import type { NextApiRequest, NextApiResponse } from 'next';
import ArticlesTable from '@/services/api/ArticlesTable';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  const id = req.body?.id;
  const article = req.body?.article;
  ArticlesTable.updateArticle(id, article.title, JSON.stringify(article.body).replaceAll('\n', '\\n'));
  res.status(200).json({});
}
