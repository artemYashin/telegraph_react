import { useQuery } from 'react-query';
import { Stack } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Article, ArticleSectionsView } from '@/types/Article';
import ArticleSections from './ArticleSections';

export interface ArticleDetailProps {
  id: Number,
  children?: React.ReactNode;
  className?: string;
}

export default function ArticleDetail(props: ArticleDetailProps) {
  const { data } = useQuery(`articleDetail${props.id}`, () => (
    axios.get<Article>(`/api/article/${props.id.toString()}`).then((res: AxiosResponse<Article>) => res.data)
  ));

  return (
    <Stack
      direction="column"
      className={props.className}
      sx={{ flex: '1' }}
    >
      <div style={{
        marginBottom: '2rem',
        marginTop: '52px',
        fontWeight: '500',
        fontSize: '30px',
        lineHeight: '44px',
      }}
      >
        { data?.title }
      </div>
      <div style={{
        fontFamily: 'Rubik',
        fontSize: '17px',
        lineHeight: '24px',
        paddingBottom: '64px',
      }}
      >
        {data ? <ArticleSections body={data?.body} view={ArticleSectionsView.DETAIL} /> : 'Loading...'}
      </div>
    </Stack>
  );
}
