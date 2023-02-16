import { Button, ButtonProps } from '@mui/material';

export default function IndexButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="outlined"
      sx={{
        border: 'none',
        display: 'flex',
        color: '#000',
        fontWeight: '400',
        fontSize: '16px',
        gap: '16px',
        justifyContent: 'flex-start',
        padding: '8px 0px',
        transition: 'all 0.3s ease',
        textTransform: 'none',
        flexDirection: 'row',
        fontFamily: 'Rubik',
        '&:hover': {
          padding: '8px 8px',
          border: 'none',
          background: '#eee',
        },
      }}
    />
  );
}
