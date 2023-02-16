import type { NextApiRequest, NextApiResponse } from 'next';
import { Article } from '@/types/Article';
import ArticlesTable from '@/services/api/ArticlesTable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article>,
) {
  const article: Article = await ArticlesTable.getArticle(Number(req.query.id));
  article.body = JSON.parse(String(article.body));
  res.status(200).json(article);
}
