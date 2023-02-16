import React from 'react';
import { Stack, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import BorderInnerIcon from '@mui/icons-material/BorderInner';
import ImageIcon from '@mui/icons-material/Image';
import BorderHorizontalIcon from '@mui/icons-material/BorderHorizontal';
import QuizIcon from '@mui/icons-material/Quiz';
import Styles from '@/styles/ArticleSection.module.css';

const articleSection = (Component: React.FC) => function ArticleSection(props: any) {
  const onDeleteHandler = () => {
    if (props?.deleteHandler) {
      props.deleteHandler();
    }
  };

  const onAddTextHandler = React.useCallback(() => {
    if (props?.addTextHandler) {
      props.addTextHandler();
    }
  }, []);

  const onAddDividerHandler = () => {
    if (props?.addDividerHandler) {
      props.addDividerHandler();
    }
  };

  const onAddSpoilerHandler = () => {
    if (props?.addSpoilerHandler) {
      props.addSpoilerHandler();
    }
  };

  const onAddImageHandler = () => {
    if (props?.addImageHandler) {
      props.addImageHandler();
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
                onClick={onAddTextHandler}
              >
                <BorderInnerIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={onAddSpoilerHandler}
              >
                <QuizIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={onAddDividerHandler}
              >
                <BorderHorizontalIcon sx={{ width: '24px' }} />
              </Button>
              <Button
                disableRipple
                className={Styles.iconButton}
                onClick={onAddImageHandler}
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
