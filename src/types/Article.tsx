export type Article = {
  id: number,
  title?: string,
  body: ArticleSection[],
  sort: number
};

export type ArticleTitle = {
  id: number,
  title?: string | undefined,
  sort: number,
};

export type ArticleContent = {
  title: string,
  body: ArticleSection[]
};

export type ArticleSection = {
  type: string,
  content: any,
  sort: number
};

export enum ArticleSectionsView {
  EDIT = 'edit',
  DETAIL = 'detail',
}
