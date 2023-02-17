import { useState } from 'react';
import dynamic from 'next/dynamic';
import Styles from '@/styles/TextSection.module.css';
import ArticleSection from './ArticleSection';
import 'react-quill/dist/quill.bubble.css';
import { ArticleSectionsView } from '@/types/Article';

export interface TextSectionProps {
  content?: {
    text?: string
  },
  view?: string;
  addFormCollector?: (content: object) => void
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TextSection = ArticleSection((props?: TextSectionProps) => {
  const [value, setValue] = useState<any>(props?.content?.text || undefined);

  if (props?.addFormCollector) {
    props.addFormCollector(async () => (new Promise((resolve) => {
      resolve({ text: value });
    })));
  }

  return (
    <ReactQuill
      readOnly={props?.view === ArticleSectionsView.DETAIL}
      placeholder={props?.view === ArticleSectionsView.DETAIL ? '' : 'Текст блока'}
      modules={{
        toolbar: [
          ['bold', 'italic', 'link', { header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
        ],
        clipboard: {
          matchVisual: false,
        },
      }}
      className={Styles.body}
      theme="bubble"
      value={value}
      onChange={setValue}
    />
  );
});

export default TextSection;
