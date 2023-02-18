import React from 'react';
import { Stack, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import BorderInnerIcon from '@mui/icons-material/BorderInner';
import ImageIcon from '@mui/icons-material/Image';
import BorderHorizontalIcon from '@mui/icons-material/BorderHorizontal';
import QuizIcon from '@mui/icons-material/Quiz';
import Styles from '@/styles/ArticleSection.module.css';
import { ArticleSectionsView } from '@/types/Article';

export enum SectionType {
  text = 'text',
  spoiler = 'spoiler',
  divider = 'divider',
  image = 'image',
}

export enum ButtonsPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

const articleSection = (Component: React.FC) => function ArticleSection(
  props: any,
) {
  const onDeleteHandler = () => {
    if (props?.deleteHandler) {
      props.deleteHandler();
    }
  };

  const onAddHandler = (type: SectionType) => {
    if (props?.addHandler) {
      props.addHandler(type);
    }
  };

  const { forwardedRef, ...rest } = props;

  return (

    <div className={`${Styles.container} ${props.view !== ArticleSectionsView.DETAIL ? Styles.container_edit : null}`}>
      { props.view === 'detail' ? (<Component {...props} />)
        : (
          <>
            <Stack direction="row" className={`${Styles.controls} ${props?.buttonsPosition === ButtonsPosition.RIGHT ? Styles.controls_right : null}`}>
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
            <Component ref={forwardedRef} {...rest} />
          </>
        )}
    </div>
  );
};

export default articleSection;
