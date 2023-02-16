import type { NextApiRequest, NextApiResponse } from 'next';
import ArticlesTable from '@/services/api/ArticlesTable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  const article = req.body?.article;
  await ArticlesTable.createArticle(article.title, JSON.stringify(article.body).replaceAll('\n', '\\n'));
  res.status(200).json({});
}
