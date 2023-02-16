import { Button, ButtonProps } from '@mui/material';
import { useRef } from 'react';
import Styles from '@/styles/LoadFileButton.module.css';

interface LoadFileButtonProps extends ButtonProps {
  setSelectedFile: Function | undefined;
}

function LoadFileButton(props: LoadFileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSelectedFile, ...buttonProps } = props;

  const handleChange = () => {
    if (setSelectedFile
      && inputRef.current && inputRef.current.files && inputRef.current.files[0]) {
      setSelectedFile(inputRef.current.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        accept=".png, .jpg, .jpeg"
        ref={inputRef}
        className={Styles.input}
        id="raised-button-file"
        multiple
        onChange={handleChange}
        type="file"
      />
      <Button
        onClick={handleClick}
        className={Styles.button}
        {...buttonProps}
      />
    </>
  );
}

export default LoadFileButton;
