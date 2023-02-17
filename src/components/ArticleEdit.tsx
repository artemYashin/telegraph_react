import { Button, Stack, TextField } from '@mui/material';
import React, {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Styles from '@/styles/ArticleEdit.module.css';
import { ArticleContent, ArticleSection } from '@/types/Article';
import ArticleSections from './ArticleSections';

export interface ArticleEditProps {
  id?: string,
  title?: string,
  body?: ArticleSection[]
}

export default function ArticleEdit(props: ArticleEditProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(props.title || '');
  const bodyRef = useRef<any>();
  const router = useRouter();

  const onDeleteArticleHandler = () => {
    axios.post('/api/article/delete', { id: props.id }).then(() => {
      router.push('/');
    });
  };

  const saveArticle = async (): Promise<void> => (new Promise((resolve, reject) => {
    if (bodyRef.current?.toJson) {
      bodyRef.current.toJson().then((bodyContent: ArticleSection[]) => {
        const article: ArticleContent = {
          title: titleInputRef.current?.value || '',
          body: bodyContent,
        };

        const saveRoute = props?.id ? '/api/article/update' : '/api/article/new';
        const data = props?.id ? { id: props.id, article } : { article };

        axios.post(saveRoute, data).then(() => {
          router.push('/');
          resolve();
        }).catch(() => {
          reject();
        });
      });
    }
  }));

  const onSaveArticleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    button.setAttribute('disabled', 'true');
    button.innerText = 'Сохранение...';
    saveArticle();
  };

  useEffect(() => {
    titleInputRef.current?.focus();
  });

  return (
    <Stack direction="column" className={Styles.container}>
      <Stack direction="row" gap={4} className={Styles.buttons}>
        <Button className={Styles.button} onClick={onSaveArticleClick}>
          Опубликовать
        </Button>
        {props.id
        && (
        <Button className={Styles.button} onClick={onDeleteArticleHandler}>
          Удалить
        </Button>
        )}
      </Stack>
      <TextField
        spellCheck={false}
        className={Styles.title}
        inputProps={{ className: Styles.title_input }}
        placeholder="Заголовок"
        fullWidth
        inputRef={titleInputRef}
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value); }}
        multiline
      />
      <Stack direction="column" gap={2} sx={{ width: '100%' }}>
        <ArticleSections
          body={props.body || []}
          ref={bodyRef}
        />
      </Stack>
    </Stack>
  );
}
