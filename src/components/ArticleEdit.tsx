import { Button, Stack, TextField } from '@mui/material';
import React, {
  ChangeEvent, MouseEventHandler, useEffect, useRef, useState,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import Styles from '@/styles/ArticleEdit.module.css';
import TextSection from './ArticleEditSections/TextSection';
import Divider from './ArticleEditSections/Divider';
import ImageSection from './ArticleEditSections/ImageSection';
import SpoilerSection from './ArticleEditSections/SpoilerSection';
import { ArticleContent, ArticleSection } from '@/types/Article';

export interface ArticleEditProps {
  id?: string,
  title?: string,
  body?: ArticleSection[]
}

export default function ArticleEdit(props: ArticleEditProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [bodyContent, setBodyContent] = useState<ArticleSection[]>(props.body || []);
  const [sortCounter, setSortCounter] = useState(props.body?.length || 1);
  const [title, setTitle] = useState(props.title || '');
  const [formCollectors] = useState<Function[]>([]);

  const router = useRouter();

  const onDeleteHandler = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index, 1);
    setBodyContent(tempBody);
  };

  const onAddDivider = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index + 1, 0, { type: 'divider', content: {}, sort: sortCounter });
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const onAddTextHandler = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index + 1, 0, { type: 'text', content: { text: '' }, sort: sortCounter });
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const onAddImageHandler = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index + 1, 0, { type: 'image', content: { text: '' }, sort: sortCounter });
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const onDeleteArticleHandler = () => {
    axios.post('/api/article/delete', { id: props.id }).then(() => {
      router.push('/');
    });
  };

  const onAddSpoilerHandler = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index + 1, 0, { type: 'spoiler', content: { text: '' }, sort: sortCounter });
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const setFormCollector = (collector: Function, index: number) => {
    formCollectors[index] = collector;
  };

  const collectBody = async () => new Promise<void>((resolve) => {
    const imagePromises: Promise<any>[] = [];
    const tempBody = Array.from(bodyContent);
    tempBody.forEach((el, index) => {
      if (el.type === 'divider') return;

      if (el.type === 'image') {
        if (!el.content.src) {
          tempBody[index].content = formCollectors[index]();
          if (el.content.file) {
            imagePromises.push(new Promise<any>((resolveImage) => {
              axios.post('/api/article/image', el.content.file, {
                headers: {
                  'content-type': el.content.file.type,
                },
              }).then((res) => {
                resolveImage({ index, src: res.data.src });
              });
            }));
          }
        }
      } else {
        tempBody[index].content = formCollectors[index]();
      }
    });

    if (imagePromises.length !== 0) {
      Promise.all(imagePromises).then((values) => {
        values.forEach((value) => {
          tempBody[value.index].content.src = value.src;
        });
        setBodyContent(tempBody);
        resolve();
      }).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });

  const saveArticle = async (e: any) => {
    e.target.setAttribute('disabled', 'true');
    e.target.innerHtml = 'Отправка...';
    await collectBody();

    const article: ArticleContent = {
      title: titleInputRef.current?.value || '',
      body: bodyContent,
    };

    article.body = article.body.map((section: ArticleSection, index: number) => {
      const newSection = section;
      newSection.sort = index;
      return newSection;
    });

    if (!props?.id) {
      axios.post('/api/article/new', { article }).then(() => {
        e.target.setAttribute('disabled', 'false');
        e.target.innerHtml = 'Отправить';
        router.push('/');
      }).catch(() => {
        e.target.setAttribute('disabled', 'false');
        e.target.innerHtml = 'Отправить';
      });
    } else if (props?.id) {
      axios.post('/api/article/update', { id: props.id, article }).then(() => {
        e.target.setAttribute('disabled', 'false');
        e.target.innerHtml = 'Отправить';
        router.push('/');
      }).catch(() => {
        e.target.setAttribute('disabled', 'false');
        e.target.innerHtml = 'Отправить';
      });
    }
  };

  const handlers = (index: number) => ({
    deleteHandler: () => onDeleteHandler(index),
    addDividerHandler: () => onAddDivider(index),
    addTextHandler: () => onAddTextHandler(index),
    addImageHandler: () => onAddImageHandler(index),
    addSpoilerHandler: () => onAddSpoilerHandler(index),
  });

  const getBody = () => bodyContent?.map((section, index) => {
    switch (section.type) {
      case 'text':
        return (
          <TextSection
            {...handlers(index)}
            view="edit"
            addFormCollector={(collector: Function) => setFormCollector(collector, index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case 'divider':
        return (
          <Divider
            {...handlers(index)}
            view="edit"
            key={String(section.sort)}
          />
        );
      case 'image':
        return (
          <ImageSection
            {...handlers(index)}
            view="edit"
            addFormCollector={(collector: Function) => setFormCollector(collector, index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case 'spoiler':
        return (
          <SpoilerSection
            {...handlers(index)}
            view="edit"
            addFormCollector={(collector: Function) => setFormCollector(collector, index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      default:
        return null;
    }
  });

  useEffect(() => {
    titleInputRef.current?.focus();

    if (bodyContent.length === 0) {
      setBodyContent([
        {
          type: 'text',
          content: {},
          sort: 0,
        },
      ]);
    }
  });

  return (
    <Stack direction="column" className={Styles.container}>
      <Stack direction="row" gap={4} className={Styles.buttons}>
        <Button className={Styles.button} onClick={saveArticle}>
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
        {getBody()}
      </Stack>
    </Stack>
  );
}
