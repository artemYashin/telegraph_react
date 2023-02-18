import {
  forwardRef, useImperativeHandle, useRef, useState,
} from 'react';
import dynamic from 'next/dynamic';
import Styles from '@/styles/TextSection.module.css';
import ArticleSection from './ArticleSection';
import 'react-quill/dist/quill.bubble.css';
import { ArticleSectionsView } from '@/types/Article';

export type TextSectionContent = {
  text?: string;
};

export interface TextSectionProps {
  content?: TextSectionContent,
  view?: string;
}

export type TextSectionHandle = {
  slice: () => { head: string, tail: string } | false;
  toJson: () => Promise<TextSectionContent>;
};

export interface ReactQuillDynamicProps {
  forwardedRef: any;
  [key: string]: any;
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    // eslint-disable-next-line react/function-component-definition, react/prop-types
    return ({ forwardedRef, ...props }: ReactQuillDynamicProps) => (
      <RQ
        ref={forwardedRef}
        {...props}
      />
    );
  },
  {
    ssr: false,
  },
);

const TextSection = ArticleSection(
  forwardRef<TextSectionHandle, TextSectionProps>((props: TextSectionProps, sectionRef: any) => {
    const [value, setValue] = useState<string | undefined>(props?.content?.text || undefined);
    const reactQuillRef = useRef<any>();

    useImperativeHandle(sectionRef, () => ({
      slice: () => {
        if (reactQuillRef?.current && reactQuillRef.current.editor) {
          const selectionStart = reactQuillRef.current.editor.selection.getNativeRange()?.start;

          if (!selectionStart || !selectionStart.node) {
            return false;
          }

          let nextNode = reactQuillRef.current.editor?.selection?.scroll?.children?.head;
          let head = '';
          let tail = '';
          let isFound = false;

          while (nextNode) {
            if (!isFound && nextNode.domNode.isEqualNode(selectionStart.node.parentNode)) {
              const headAppend = document.createElement(nextNode.domNode.localName);
              const tailAppend = document.createElement(nextNode.domNode.localName);
              headAppend.innerHTML = nextNode.domNode.innerHTML.slice(0, selectionStart.offset);
              tailAppend.innerHTML = nextNode.domNode.innerHTML.slice(selectionStart.offset);
              if (headAppend.innerHTML) head += headAppend.outerHTML;
              if (tailAppend.innerHTML) tail += tailAppend.outerHTML;
              isFound = true;
              if (nextNode?.next) {
                nextNode = nextNode.next;
              } else {
                break;
              }
              // eslint-disable-next-line no-continue
              continue;
            }
            if (!isFound) {
              head += nextNode.domNode.outerHTML;
            } else {
              tail += nextNode.domNode.outerHTML;
            }
            if (nextNode?.next) {
              nextNode = nextNode.next;
            } else {
              break;
            }
          }

          if (head || tail) {
            return {
              head, tail,
            };
          }
        }

        return false;
      },
      toJson: () => new Promise<object>((resolve) => {
        resolve({ text: value });
      }),
      value,
      setValue,
    }));

    return (
      <ReactQuill
        forwardedRef={reactQuillRef}
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
  }),
);

export default TextSection;
