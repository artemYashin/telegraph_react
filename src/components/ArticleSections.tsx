import {
  forwardRef, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
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
  watermark?: any;
}

export type ArticleSectionsHandle = {
  toJson: () => Promise<ArticleSection[]>;
  props: ArticleSectionsProps;
};

function ArticleSections(props: ArticleSectionsProps, compRef: any) {
  const [bodyContent, setBodyContent] = useState<ArticleSection[]>(props?.body || []);
  const [sortCounter, setSortCounter] = useState(props?.body?.length || 1);
  const refs = useRef<any>([]);

  const updateRefs = (index: any, element: any) => {
    refs.current[index] = element;
  };

  const onDeleteHandler = (index: number) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index, 1);
    setBodyContent(tempBody);
  };

  const addSection = (index: number, content: any) => {
    const tempBody = Array.from(bodyContent);
    tempBody.splice(index, 0, content);
    setBodyContent(tempBody);
    setSortCounter((prev) => prev + 1);
  };

  const onAddHandler = (index: number, type: string) => {
    if (bodyContent[index].type === SectionType.text) {
      if (refs.current[index] && refs.current[index].slice) {
        const section = refs.current[index];
        const slice = section.slice();

        if (slice !== false) {
          if (slice.head === '' || slice.tail === '') {
            if (slice.head === '') {
              slice.head = slice.tail;
              addSection(
                index,
                { type, content: {}, sort: sortCounter },
              );
            } else {
              addSection(
                index + 1,
                { type, content: {}, sort: sortCounter },
              );
            }
            section.setValue(slice.head);
          } else {
            section.setValue(slice.head);
            const tempBody = Array.from(bodyContent);
            tempBody.splice(index + 1, 0, { type, content: {}, sort: sortCounter });
            tempBody.splice(index + 2, 0, {
              type: bodyContent[index].type,
              content: { text: slice.tail },
              sort: sortCounter + 1,
            });
            setBodyContent(tempBody);
            setSortCounter((prev) => prev + 2);
          }

          return;
        }
      }
    }

    addSection(index + 1, { type, content: {}, sort: sortCounter });
  };

  // eslint-disable-next-line no-async-promise-executor
  const parseBody = async () => new Promise<ArticleSection[]>((resolve) => {
    const tempBody = Array.from(bodyContent);
    const promises = [];

    for (let i = 0; i < tempBody.length; i += 1) {
      if (tempBody[i].type !== 'divider'
        && refs.current[i]?.toJson) {
        promises.push(new Promise<void>((resolveContent) => {
          refs.current[i].toJson().then((content: object) => {
            tempBody[i].content = content;
            resolveContent();
          });
        }));
      }
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

  useImperativeHandle(compRef, () => ({
    toJson: async () => new Promise((resolve) => {
      getBody().then((body: ArticleSection[]) => {
        resolve(body);
      });
    }),
  }));

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
  }, []);

  const mutualProps = (index: number) => ({
    deleteHandler: () => onDeleteHandler(index),
    forwardedRef: (element: any) => updateRefs(index, element),
    addHandler: (type: string) => onAddHandler(index, type),
    view: props?.view || ArticleSectionsView.EDIT,
    buttonsPosition: props?.buttonsPosition || ButtonsPosition.LEFT,
  });

  const renderBody = () => bodyContent?.map((section, index) => {
    switch (section.type) {
      case SectionType.text:
        return (
          <TextSection
            {...mutualProps(index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case SectionType.divider:
        return (
          <Divider
            {...mutualProps(index)}
            key={String(section.sort)}
          />
        );
      case SectionType.image:
        return (
          <ImageSection
            {...mutualProps(index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      case SectionType.spoiler:
        return (
          <SpoilerSection
            {...mutualProps(index)}
            key={String(section.sort)}
            content={section.content}
          />
        );
      default:
        return null;
    }
  });
  console.log(props);
  return (
    <div className={Styles.sections_container}>
      {props.watermark?.state ? (
        <div
          className={Styles.watermark}
          style={{
            backgroundImage: 'url(/api/public/watermark.png)',
            backgroundSize: `${props.watermark.size * 100}px`,
            opacity: `${props.watermark.opacity}`,
          }}
        />
      ) : null}
      {renderBody()}
    </div>
  );
}

export default forwardRef<ArticleSectionsHandle, ArticleSectionsProps>(ArticleSections);
