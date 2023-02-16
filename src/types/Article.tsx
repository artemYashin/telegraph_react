export type Article = {
  id: number,
  title: string,
  body: Array<ArticleSection>,
  sort: number
};

export type ArticleTitle = {
  id: number,
  title: String,
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
