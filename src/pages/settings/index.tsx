import {
  Button,
  FormControl, Slider, TextField,
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
  const isWatermarkExists = await isFileExists('public/watermark.png');
  const isPasswordRequired = (await SettingsTable.findSetting('user_password_state')).value;
  const isWatermarkRequired: boolean = await SettingsTable.findSetting('watermark_state').then((res) => res.value === 'yes').catch(() => false);

  const props = {
    isPasswordRequired,
    isLogoExists,
    isWatermarkRequired,
    isWatermarkExists,
    watermarkOpacity: 1.0,
    watermarkSize: 1.0,
  };

  if (isWatermarkRequired) {
    await SettingsTable.findSetting('watermark_opacity').then((res: any) => {
      props.watermarkOpacity = res.value as number;
    }).catch(() => 1.0);
    await SettingsTable.findSetting('watermark_size').then((res: any) => {
      props.watermarkSize = res.value as number;
    }).catch(() => 1.0);
  }

  return {
    props,
  };
}

function Settings(props: any) {
  const { isPasswordRequired, isWatermarkRequired, isWatermarkExists } = props;

  const [passwordState, setPasswordState] = useState<string>('no');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [readedImage, setReadedImage] = useState<string | undefined>();

  const [watermarkState, setWatermarkState] = useState<boolean>(isWatermarkRequired);
  const [watermarkSettings, setWatermarkSettings] = useState<any>({
    opacity: Number(props.watermarkOpacity),
    size: Number(props.watermarkSize),
  });
  const [selectedWatermark, setSelectedWatermark] = useState<File | null>(null);
  const readedWatermark = useRef<string | null>(null);

  const userPasswordRef = useRef<HTMLInputElement>(null);
  const adminPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPasswordRequired) {
      setPasswordState(isPasswordRequired);
    }
  }, []);

  const router = useRouter();

  const handleWatermarkChange = (image: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        readedWatermark.current = reader.result as string;
        setSelectedWatermark(image);
      }
    };

    reader.readAsDataURL(image);
  };

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

  const handleWatermarkRadio = (event: MouseEvent<HTMLButtonElement>) => {
    setWatermarkState((event.target as HTMLButtonElement).getAttribute('value') === 'yes');
  };

  const handleHomeButton = () => {
    router.push('/');
  };

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const settingsToSave: any = {};

    if (isPasswordRequired !== passwordState) {
      settingsToSave.passwordState = passwordState;
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

    if (watermarkState !== props.isWatermarkRequired
    || watermarkSettings.size !== props.watermarkSize
    || watermarkSettings.opacity !== props.watermarkOpacity) {
      if (selectedWatermark) {
        axios.post('/api/settings/watermark', selectedWatermark, {
          headers: {
            'content-type': selectedWatermark.type,
          },
        }).then(() => {
          window.location.href = '/';
        });
      }

      if (selectedWatermark || isWatermarkExists) {
        settingsToSave.watermark = watermarkSettings;
        settingsToSave.watermark.state = watermarkState ? 'yes' : 'no';
      }
    }

    if (Object.keys(settingsToSave).length > 0) {
      axios.post('/api/settings/save', settingsToSave).then(() => {
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
            <Stack direction="column" className={SettingsStyle.input_container}>
              <p className={SettingsStyle.label}>Водный знак</p>
              <FormControl>
                <Stack direction="column" className={SettingsStyle.input_container}>
                  <Stack direction="row" justifyContent="space-between" gap="30px">
                    <Button disableRipple className={`${SettingsStyle.password_button} ${watermarkState ? SettingsStyle.password_button_selected : null}`} value="yes" onClick={handleWatermarkRadio}>
                      Да
                    </Button>
                    <Button disableRipple className={`${SettingsStyle.password_button} ${!watermarkState ? SettingsStyle.password_button_selected : null}`} value="no" onClick={handleWatermarkRadio}>
                      Нет
                    </Button>
                  </Stack>
                  { watermarkState
                    ? (
                      <>
                        {readedWatermark.current || isWatermarkExists
                          ? (
                            <Stack direction="column">
                              <div
                                className={SettingsStyle.preview}
                                style={{
                                  backgroundImage: `url(${readedWatermark.current ?? (isWatermarkExists ? '/api/public/watermark.png' : null)})`,
                                  opacity: watermarkSettings.opacity,
                                  minWidth: '100%',
                                  height: 140,
                                  backgroundSize: `${watermarkSettings.size * 100}px`,
                                }}
                              />
                              <p className={SettingsStyle.label} style={{ marginTop: '10px' }}>Прозрачность</p>
                              <Slider
                                defaultValue={Number(props.watermarkOpacity)}
                                valueLabelDisplay="auto"
                                min={0.001}
                                max={1.0}
                                step={0.001}
                                sx={{
                                  '.MuiSlider-track': {
                                    color: '#000',
                                  },
                                  '.MuiSlider-thumb': {
                                    color: '#777',
                                  },
                                  '.MuiSlider-thumb:hover': {
                                    boxShadow: '0px 0px 0px 6px rgba(119,119,119,0.2)',
                                  },
                                  '.MuiSlider-rail': {
                                    color: '#ddd',
                                  },
                                }}
                                onChange={(val: any) => {
                                  setWatermarkSettings(
                                    (prev: any) => ({ ...prev, opacity: val.target.value }),
                                  );
                                }}
                              />
                              <p className={SettingsStyle.label}>Размер</p>
                              <Slider
                                defaultValue={Number(props.watermarkSize)}
                                valueLabelDisplay="auto"
                                min={0.1}
                                max={4.0}
                                step={0.05}
                                sx={{
                                  '.MuiSlider-track': {
                                    color: '#000',
                                  },
                                  '.MuiSlider-thumb': {
                                    color: '#777',
                                  },
                                  '.MuiSlider-thumb:hover': {
                                    boxShadow: '0px 0px 0px 6px rgba(119,119,119,0.2)',
                                  },
                                  '.MuiSlider-rail': {
                                    color: '#ddd',
                                  },
                                }}
                                onChange={(val: any) => {
                                  setWatermarkSettings(
                                    (prev: any) => ({ ...prev, size: val.target.value }),
                                  );
                                }}
                              />
                            </Stack>
                          )
                          : null}
                        <LoadFileButton setSelectedFile={handleWatermarkChange}>
                          <AddIcon sx={{ width: '15px' }} />
                          Выбрать файл
                        </LoadFileButton>
                      </>
                    ) : null}
                </Stack>
              </FormControl>
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
