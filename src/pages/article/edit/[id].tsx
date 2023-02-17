import ArticleEdit from '@/components/ArticleEdit';
import ArticlesTable from '@/services/api/ArticlesTable';
import { ArticleSection } from '@/types/Article';

export async function getServerSideProps(context: any) {
  const id: string = context?.params?.id;
  if (id) {
    const article = await ArticlesTable.getArticle(Number(id));
    article.body = JSON.parse(String(article.body));

    article.body.map((section: ArticleSection, index: number) => {
      const newSection = section;
      newSection.sort = index;
      return newSection;
    });

    return {
      props: {
        id,
        title: article.title,
        body: article.body,
      },
    };
  }

  return {
    props: {},
  };
}

export default function AddArticle(props: any) {
  return (
    <ArticleEdit {...props} />
  );
}
