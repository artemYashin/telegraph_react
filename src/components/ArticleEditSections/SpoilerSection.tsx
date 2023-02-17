import {
  Accordion, AccordionDetails, AccordionSummary, TextField,
} from '@mui/material';
import React, {
  forwardRef, useImperativeHandle, useRef, useState,
} from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import Styles from '@/styles/SpoilerSection.module.css';
import ArticleSectionWrapper, { ButtonsPosition } from './ArticleSection';
// eslint-disable-next-line import/no-cycle
import ArticleSections from '../ArticleSections';
import { ArticleSection, ArticleSectionsView } from '@/types/Article';

export interface SpoilerSectionProps {
  content?: {
    title?: string;
    body?: ArticleSection[];
  },
  view?: string;
}

const SpoilerSection = ArticleSectionWrapper(
  forwardRef((props: SpoilerSectionProps, sectionRef: any) => {
    const [content, setContent] = useState({ title: props?.content?.title || '', body: props?.content?.body || undefined });
    const [expanded, setExpanded] = useState(false);
    const sectionsRef = useRef<any>(null);

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setContent({ ...content, title: event.target.value });
    };

    useImperativeHandle(sectionRef, () => ({
      toJson: async () => new Promise((resolve) => {
        if (sectionsRef.current?.toJson) {
          sectionRef.current?.toJson().then((bodyContent: ArticleSection[]) => {
            setContent({ ...content, body: bodyContent });
            resolve({ ...content, body: bodyContent });
          });
        }
      }),
    }));

    return (
      <div>
        { props?.view === 'detail'
          ? (
            <Accordion
              expanded={expanded}
              className={Styles.accordion}
              onChange={
              (event: React.SyntheticEvent, expandedState: boolean) => {
                setExpanded(expandedState);
              }
            }
            >
              <AccordionSummary className={Styles.accordion_summary}>
                {content.title}
                { expanded ? <RemoveCircleOutlineRoundedIcon /> : <AddCircleOutlineRoundedIcon /> }
              </AccordionSummary>
              <AccordionDetails className={Styles.accordion_details}>
                <ArticleSections body={content?.body} view={ArticleSectionsView.DETAIL} />
              </AccordionDetails>
            </Accordion>
          )
          : (
            <div
              className={Styles.root_container}
              style={{
                border: '1px solid #ddd', padding: '16px 40px', borderRadius: 8, boxSizing: 'border-box',
              }}
            >
              <div className={Styles.container}>
                <TextField
                  spellCheck={false}
                  fullWidth
                  placeholder="Заголовок спойлера"
                  className={Styles.title}
                  onChange={onTitleChange}
                  value={content.title}
                  inputProps={{ className: Styles.title_input }}
                />
              </div>
              <div className={`${Styles.container} ${Styles.accordion_details}`}>
                <ArticleSections
                  body={content?.body}
                  ref={sectionsRef}
                  buttonsPosition={ButtonsPosition.RIGHT}
                />
              </div>
            </div>
          )}
      </div>
    );
  }),
);

export default SpoilerSection;
