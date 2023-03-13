import { useQuery } from 'react-query';
import { Stack } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Article, ArticleSectionsView } from '@/types/Article';
import ArticleSections from './ArticleSections';
import Styles from '@/styles/ArticleDetail.module.css';

export interface ArticleDetailProps {
  id: Number,
  children?: React.ReactNode;
  className?: string;
  watermark?: any;
}

export default function ArticleDetail(props: ArticleDetailProps) {
  const { data } = useQuery(`articleDetail${props.id}`, () => {
    if (props.id) {
      return axios.get<Article>(`/api/article/${props.id.toString()}`).then((res: AxiosResponse<Article>) => res.data);
    }

    return null;
  });

  return (
    <Stack
      direction="column"
      className={props.className}
      sx={{
        flex: '1',
        position: 'relative',
        userSelect: 'none',
        cursor: 'default',
        'p, span, blockquote': {
          userSelect: 'none',
          cursor: 'default',
        },
        img: {
          userSelect: 'none',
          cursor: 'default',
          pointerEvents: 'none',
        },
      }}
    >
      <div className={Styles.title}>
        { data?.title }
      </div>
      <div style={{
        fontFamily: 'Rubik',
        fontSize: '17px',
        lineHeight: '24px',
        paddingBottom: '64px',
      }}
      >
        {data ? <ArticleSections watermark={props.watermark} body={data?.body} view={ArticleSectionsView.DETAIL} /> : 'Loading...'}
      </div>
    </Stack>
  );
}
