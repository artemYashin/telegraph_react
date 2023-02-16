import axios from 'axios';
import { useEffect, useState } from 'react';
import { ArticleSection } from '@/types/Article';
import { SectionType } from './ArticleEditSections/ArticleSection';
import Divider from './ArticleEditSections/Divider';
import ImageSection from './ArticleEditSections/ImageSection';
import SpoilerSection from './ArticleEditSections/SpoilerSection';
import TextSection from './ArticleEditSections/TextSection';

export interface ArticleSectionsProps {
  body?: ArticleSection[];
  bodyCollector?: Function;
}

export default function ArticleSections(props?: ArticleSectionsProps) {
  const [bodyContent, setBodyContent] = useState<ArticleSection[]>(props?.body || []);
  const [sortCounter, setSortCounter] = useState(props?.body?.length || 1);
  const [formCollectors] = useState<Function[]>([]);

  const onDeleteHandler = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index, 1);
    setBodyContent(tempBody);
  };

  const onAddHandler = (index: number, type: string) => {
    const tempBody = Array.from(bodyContent);
    console.log(type);
    tempBody.splice(index + 1, 0, { type, content: {}, sort: sortCounter });
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const setFormCollector = (collector: Function, index: number) => {
    formCollectors[index] = collector;
  };

  const parseBody = async () => new Promise<ArticleSection[]>((resolve) => {
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
        console.log(tempBody[index].content);
      }
    });

    if (imagePromises.length !== 0) {
      Promise.all(imagePromises).then((values) => {
        values.forEach((value) => {
          tempBody[value.index].content.src = value.src;
        });
        resolve(tempBody);
      }).then(() => {
        resolve(tempBody);
      });
    } else {
      resolve(tempBody);
    }
  });

  const getBody = async (): Promise<ArticleSection[]> => (
    new Promise<ArticleSection[]>((resolve) => {
      parseBody().then((body) => {
        let newBody = body;
        newBody = body.map<ArticleSection>(
          (section: ArticleSection, index: number): ArticleSection => {
            const tempSection = section;
            tempSection.sort = index;
            return tempSection;
          },
        );

        resolve(newBody);
      });
    })
  );

  if (props?.bodyCollector) {
    props.bodyCollector(getBody);
  }

  useEffect(() => {
    if (bodyContent.length === 0) {
      setBodyContent([
        {
          type: SectionType.text,
          content: {},
          sort: 0,
        },
      ]);
    }
  });

  const handlers = (index: number) => ({
    deleteHandler: () => onDeleteHandler(index),
    addHandler: (type: string) => onAddHandler(index, type),
  });

  const renderBody = () => bodyContent?.map((section, index) => {
    switch (section.type) {
      case SectionType.text:
        return (
          <TextSection
            {...handlers(index)}
            view="edit"
            addFormCollector={(collector: Function) => setFormCollector(collector, index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case SectionType.divider:
        return (
          <Divider
            {...handlers(index)}
            view="edit"
            key={String(section.sort)}
          />
        );
      case SectionType.image:
        return (
          <ImageSection
            {...handlers(index)}
            view="edit"
            addFormCollector={(collector: Function) => setFormCollector(collector, index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case SectionType.spoiler:
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

  return (
    <div>
      {renderBody()}
    </div>
  );
}
