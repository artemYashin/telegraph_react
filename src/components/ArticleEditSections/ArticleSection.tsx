import React from 'react';
import { Stack, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import BorderInnerIcon from '@mui/icons-material/BorderInner';
import ImageIcon from '@mui/icons-material/Image';
import BorderHorizontalIcon from '@mui/icons-material/BorderHorizontal';
import QuizIcon from '@mui/icons-material/Quiz';
import Styles from '@/styles/ArticleSection.module.css';

export enum SectionType {
  text = 'text',
  spoiler = 'spoiler',
  divider = 'divider',
  image = 'image',
}

const articleSection = (Component: React.FC) => function ArticleSection(props: any) {
  const onDeleteHandler = () => {
    if (props?.deleteHandler) {
      props.deleteHandler();
    }
  };

  const onAddHandler = (type: SectionType) => {
    if (props?.addHandler) {
      console.log(type);
      props.addHandler(type);
    }
  };

  return (

    <div className={Styles.container}>
      { props.view === 'detail' ? (<Component {...props} />)
        : (
          <>
            <Stack direction="row" className={Styles.controls}>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={() => { onAddHandler(SectionType.text); }}
              >
                <BorderInnerIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={() => { onAddHandler(SectionType.spoiler); }}
              >
                <QuizIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={() => { onAddHandler(SectionType.divider); }}
              >
                <BorderHorizontalIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={() => { onAddHandler(SectionType.image); }}
              >
                <ImageIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={onDeleteHandler}
              >
                <ClearIcon sx={{ width: '24px' }} />
              </Button>
            </Stack>
            <Component {...props} />
          </>
        )}
    </div>
  );
};

export default articleSection;
