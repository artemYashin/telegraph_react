import { useEffect, useState } from 'react';
import { ArticleSection, ArticleSectionsView } from '@/types/Article';
import { ButtonsPosition, SectionType } from './ArticleEditSections/ArticleSection';
import Divider from './ArticleEditSections/Divider';
import ImageSection from './ArticleEditSections/ImageSection';
// eslint-disable-next-line import/no-cycle
import SpoilerSection from './ArticleEditSections/SpoilerSection';
import TextSection from './ArticleEditSections/TextSection';
import Styles from '@/styles/ArticleSections.module.css';

export interface ArticleSectionsProps {
  body?: ArticleSection[];
  view?: ArticleSectionsView;
  bodyCollector?: Function;
  buttonsPosition?: ButtonsPosition;
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
    tempBody.splice(index + 1, 0, { type, content: {}, sort: sortCounter });
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const setFormCollector = (collector: Function, index: number) => {
    formCollectors[index] = collector;
  };

  // eslint-disable-next-line no-async-promise-executor
  const parseBody = async () => new Promise<ArticleSection[]>((resolve) => {
    const tempBody = Array.from(bodyContent);
    const promises = [];
    for (let i = 0; i < tempBody.length; i += 1) {
      if (tempBody[i].type === 'divider') {
        // eslint-disable-next-line no-continue
        continue;
      }

      promises.push(new Promise<void>((resolveContent) => {
        formCollectors[i]().then((content: object) => {
          tempBody[i].content = content;
          resolveContent();
        });
      }));
    }

    Promise.all(promises).then(() => {
      resolve(tempBody);
    });
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
    addFormCollector: (collector: Function) => setFormCollector(collector, index),
    view: props?.view || ArticleSectionsView.EDIT,
    buttonsPosition: props?.buttonsPosition || ButtonsPosition.LEFT,
  });

  const renderBody = () => bodyContent?.map((section, index) => {
    switch (section.type) {
      case SectionType.text:
        return (
          <TextSection
            {...handlers(index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case SectionType.divider:
        return (
          <Divider
            {...handlers(index)}
            key={String(section.sort)}
          />
        );
      case SectionType.image:
        return (
          <ImageSection
            {...handlers(index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case SectionType.spoiler:
        return (
          <SpoilerSection
            {...handlers(index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      default:
        return null;
    }
  });

  return (
    <div className={Styles.sections_container}>
      {renderBody()}
    </div>
  );
}
