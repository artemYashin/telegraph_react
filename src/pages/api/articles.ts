// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Article, ArticleTitle } from '@/types/Article';
import ArticlesTable from '@/services/api/ArticlesTable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ArticleTitle[]>,
) {
  const articles: Article[] = await ArticlesTable.getArticles();
  res.status(200).json(articles);
}
