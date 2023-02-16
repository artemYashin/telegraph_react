import { useQuery } from 'react-query';
import { Stack } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Article } from '@/types/Article';
import TextSection from './ArticleEditSections/TextSection';
import ImageSection from './ArticleEditSections/ImageSection';
import SpoilerSection from './ArticleEditSections/SpoilerSection';
import Divider from './ArticleEditSections/Divider';

export interface ArticleDetailProps {
  id: Number,
  children?: React.ReactNode;
  className?: string;
}

export default function ArticleDetail(props: ArticleDetailProps) {
  const { data } = useQuery(`articleDetail${props.id}`, () => (
    axios.get<Article>(`/api/article/${props.id.toString()}`).then((res: AxiosResponse<Article>) => res.data)
  ));

  const getBody = () => data?.body?.map((section, index) => {
    switch (section.type) {
      case 'text':
        return (
          <TextSection
            key={String(index)}
            view="detail"
            content={section.content}
          />
        );
      case 'divider':
        return (
          <Divider
            view="detail"
            key={String(section.sort)}
          />
        );
      case 'image':
        return (
          <ImageSection
            key={String(index)}
            view="detail"
            content={section.content}
          />
        );
      case 'spoiler':
        return (
          <SpoilerSection
            key={String(index)}
            view="detail"
            content={section.content}
          />
        );
      default:
        return null;
    }
  });

  return (
    <Stack
      direction="column"
      className={props.className}
      sx={{ flex: '1' }}
    >
      <div style={{
        marginBottom: '1rem',
        marginTop: '-10px',
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
      }}
      >
        { getBody() }
      </div>
    </Stack>
  );
}
