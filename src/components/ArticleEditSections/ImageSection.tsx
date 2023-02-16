import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import LoadFileButton from '../LoadFileButton';
import ArticleSection from './ArticleSection';
import Styles from '@/styles/ImageSection.module.css';

export interface ImageSectionProps {
  content?: {
    src?: string;
    file?: File;
  },
  addFormCollector?: (content: object) => void
}

const ImageSection = ArticleSection((props?: ImageSectionProps) => {
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

  if (props?.addFormCollector) {
    props.addFormCollector(() => ({ src, file }));
  }

  return (
    <div>
      {
      !src
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
});

export default ImageSection;
