import {
  Button,
  FormControl, TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import {
  FormEvent, MouseEvent, useState, useEffect, useRef,
} from 'react';
import AddIcon from '@mui/icons-material/Add';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useRouter } from 'next/dist/client/router';
import axios from 'axios';
import SettingsStyle from '@/styles/Settings.module.css';
import LoadFileButton from '@/components/LoadFileButton';
import SettingsTable from '@/services/api/SettingsTable';
import isFileExists from '@/services/api/isFileExists';

export async function getServerSideProps() {
  const isLogoExists = await isFileExists('public/logo.png');
  const isPasswordRequired = (await SettingsTable.findSetting('user_password_state')).value;

  return {
    props: {
      isPasswordRequired,
      isLogoExists,
    },
  };
}

function Settings(props: any) {
  const [passwordState, setPasswordState] = useState<string>('no');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [readedImage, setReadedImage] = useState<string | undefined>();
  const userPasswordRef = useRef<HTMLInputElement>(null);
  const adminPasswordRef = useRef<HTMLInputElement>(null);
  const { isPasswordRequired } = props;

  useEffect(() => {
    if (isPasswordRequired) {
      setPasswordState(isPasswordRequired);
    }
  }, []);

  const router = useRouter();

  const handleImageChange = (image: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        setReadedImage(reader.result as string);
        setSelectedImage(image);
      }
    };

    reader.readAsDataURL(image);
  };

  const handlePasswordRadio = (event: MouseEvent<HTMLButtonElement>) => {
    setPasswordState((event.target as HTMLButtonElement).getAttribute('value') as string);
  };

  const handleHomeButton = () => {
    router.push('/');
  };

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPasswordRequired !== passwordState) {
      axios.post('/api/settings/save', {
        passwordState,
      }).then(() => {
        router.push('/');
      });
    }

    if (userPasswordRef.current && userPasswordRef.current.value) {
      axios.post('/api/settings/password', {
        rights: 'user',
        password: userPasswordRef.current.value,
      }).then(() => {
        router.push('/');
      });
    }

    if (adminPasswordRef.current && adminPasswordRef.current.value) {
      axios.post('/api/settings/password', {
        rights: 'admin',
        password: adminPasswordRef.current.value,
      }).then(() => {
        router.push('/');
      });
    }

    if (selectedImage) {
      axios.post('/api/settings/logo', selectedImage, {
        headers: {
          'content-type': selectedImage.type,
        },
      }).then(() => {
        window.location.href = '/';
      });
    }
  };

  return (
    <form
      onSubmit={formSubmit}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack direction="column" className={SettingsStyle.container}>
        <Stack direction="column" className={SettingsStyle.container_inner}>
          <Button
            onClick={handleHomeButton}
            className={SettingsStyle.homeButton}
          >
            <HomeRoundedIcon />
          </Button>
          <div
            className={SettingsStyle.title}
          >
            Настройки
          </div>
          <Stack direction="column" className={SettingsStyle.fields_container}>
            <Stack direction="column" className={SettingsStyle.input_container}>
              <p className={SettingsStyle.label}>Пароль администратора</p>
              <TextField inputRef={adminPasswordRef} inputProps={{ className: SettingsStyle.input }} placeholder="******" size="small" />
            </Stack>
            <FormControl>
              <Stack direction="column" className={SettingsStyle.input_container}>
                <p className={SettingsStyle.label}>Пароль для пользователей</p>
                <Stack direction="row" justifyContent="space-between" gap="30px">
                  <Button disableRipple className={`${SettingsStyle.password_button} ${passwordState === 'yes' ? SettingsStyle.password_button_selected : null}`} value="yes" onClick={handlePasswordRadio}>
                    Да
                  </Button>
                  <Button disableRipple className={`${SettingsStyle.password_button} ${passwordState === 'no' ? SettingsStyle.password_button_selected : null}`} value="no" onClick={handlePasswordRadio}>
                    Нет
                  </Button>
                </Stack>
                { passwordState === 'yes' ? <TextField inputRef={userPasswordRef} inputProps={{ className: SettingsStyle.input }} placeholder="******" size="small" /> : null }
              </Stack>
            </FormControl>

            <Stack direction="column" className={SettingsStyle.input_container}>
              <p className={SettingsStyle.label}>Установить лого (365x146)</p>
              <img className={SettingsStyle.preview} alt="logo" src={readedImage || '/logo.png'} />

              <LoadFileButton setSelectedFile={handleImageChange}>
                <AddIcon sx={{ width: '15px' }} />
                Выбрать файл
              </LoadFileButton>
            </Stack>
            <Button type="submit" className={SettingsStyle.saveButton}>
              Сохранить
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
export default Settings;
