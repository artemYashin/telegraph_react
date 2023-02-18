import AddIcon from '@mui/icons-material/Add';
import { forwardRef, useImperativeHandle, useState } from 'react';
import axios from 'axios';
import LoadFileButton from '../LoadFileButton';
import ArticleSection from './ArticleSection';
import Styles from '@/styles/ImageSection.module.css';
import { ArticleSectionsView } from '@/types/Article';

export type ImageSectionContent = {
  src?: string;
};

export interface ImageSectionProps {
  content?: ImageSectionContent,
  view?: string;
}

export type ImageSectionHandle = {
  toJson: () => Promise<{ src?: string }>;
  props: ImageSectionProps;
};

const ImageSection = ArticleSection(forwardRef((props: ImageSectionProps, sectionRef: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | undefined>(props?.content?.src);

  const handleSelectImage = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        setSrc(reader.result as string);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  useImperativeHandle(sectionRef, () => ({
    toJson: () => new Promise((resolve) => {
      if (file) {
        axios.post('/api/article/image', file, {
          headers: {
            'content-type': file.type,
          },
        }).then((res: any) => {
          resolve({ src: res.data.src });
        });
      } else {
        resolve({ src });
      }
    }),
  }));

  return (
    <div>
      {
      !src && props?.view !== ArticleSectionsView.DETAIL
        ? (
          <LoadFileButton setSelectedFile={handleSelectImage}>
            <AddIcon sx={{ width: '15px' }} />
            Выбрать файл
          </LoadFileButton>
        ) : (
          <img className={Styles.image} alt="imgsection" src={src} />
        )
      }
    </div>
  );
}));

export default ImageSection;
