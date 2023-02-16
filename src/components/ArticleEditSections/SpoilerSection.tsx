import {
  Accordion, AccordionDetails, AccordionSummary, TextField,
} from '@mui/material';
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Styles from '@/styles/SpoilerSection.module.css';
import ArticleSection from './ArticleSection';
import TextSection from './TextSection';

export interface SpoilerSectionProps {
  content?: {
    title?: string;
    body?: string;
  },
  view?: string;
  addFormCollector?: (content: object) => void
}

const SpoilerSection = ArticleSection((props?: SpoilerSectionProps) => {
  const [content, setContent] = useState({ title: props?.content?.title || '', body: props?.content?.body || '' });

  const [expanded, setExpanded] = useState(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent({ ...content, title: event.target.value });
  };

  const onBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent({ ...content, body: event.target.value });
  };

  if (props?.addFormCollector) {
    props.addFormCollector(() => (content));
  }

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
              { expanded ? <RemoveCircleIcon /> : <AddCircleIcon /> }
            </AccordionSummary>
            <AccordionDetails className={Styles.accordion_details}>
              {content.body}
            </AccordionDetails>
          </Accordion>
        )
        : (
          <div
            className={Styles.container}
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
            <div className={Styles.container}>
              <TextSection
                spellCheck={false}
                fullWidth
                placeholder="Текст контейнера"
                className={Styles.body}
                inputProps={{ className: Styles.body_input }}
                onChange={onBodyChange}
                value={content.body}
                multiline
              />
            </div>
          </div>
        )}
    </div>
  );
});

export default SpoilerSection;
