import { Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Image from 'next/image';
import { FormEvent, MouseEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/AuthService';
import lock from '../../../public/lock.svg';

function Login() {
  const passwordInput = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (passwordInput.current !== null) {
      authService.login(passwordInput.current.value).then((res) => {
        if (res) {
          router.reload();
        }
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        <Image alt="lock" src={lock} />
        <Typography sx={{ fontWeight: 'bolder', fontSize: '2em', marginBottom: '16px' }}>Введите пароль</Typography>
        <TextField
          placeholder="******"
          variant="outlined"
          size="small"
          inputRef={passwordInput}
          type="password"
          sx={{
            '& .MuiInputBase-input': {
              display: 'flex',
              fontSize: '24px',
              padding: '4px 16px',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              '&::placeholder': {
                width: '100%',
                textAlign: 'center',
                transform: 'translateY(5px)',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            background: '#d8d8d8',
            marginTop: '20px',
            color: 'black',
            textTransform: 'none',
            fontSize: '1em',
            padding: '10px 58px',
            fontWeight: '400',
            boxShadow: 'none',
            fontFamily: 'Rubik',
            ':hover': {
              background: '#afafaf',
              boxShadow: 'none',
            },
          }}
        >
          Войти
        </Button>

      </Stack>
    </form>
  );
}

export default Login;
