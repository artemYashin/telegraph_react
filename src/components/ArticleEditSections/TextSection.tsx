import { useState } from 'react';
import dynamic from 'next/dynamic';
import Styles from '@/styles/TextSection.module.css';
import ArticleSection from './ArticleSection';
import 'react-quill/dist/quill.bubble.css';

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
    props.addFormCollector(() => ({ text: value }));
  }

  return (
    <>
      {/* <QuillToolbar />   */}
      <ReactQuill
        readOnly={props?.view === 'detail'}
        placeholder="Текст блока"
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
    </>
  );
});

export default TextSection;
