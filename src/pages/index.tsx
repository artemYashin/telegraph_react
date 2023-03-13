import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Head from 'next/head';
import { useStore } from '@/store/store';
import ArticlesList from '@/components/ArticlesList';
import ArticleDetail from '@/components/ArticleDetail';
import { useLogout, useUser } from '@/services/AuthHooks';
import IndexButton from '@/components/IndexButton';
import IndexStyles from '@/styles/Index.module.css';
import validateRoute from '@/services/api/ValidateRoute';
import isFileExists from '@/services/api/isFileExists';
import SettingsTable from '@/services/api/SettingsTable';

export async function getServerSideProps(context: any) {
  const ssr: any = { ...validateRoute(context.req), props: {} };
  const isWatermarkExists = await isFileExists('public/watermark.png');
  const isWatermarkRequired: boolean = await SettingsTable.findSetting('watermark_state').then((res) => res.value === 'yes').catch(() => false);

  if (isWatermarkExists && isWatermarkRequired) {
    ssr.props.watermark = { state: true };
    await SettingsTable.findSetting('watermark_opacity').then((res: any) => {
      ssr.props.watermark.opacity = res.value as number;
    }).catch(() => 1.0);
    await SettingsTable.findSetting('watermark_size').then((res: any) => {
      ssr.props.watermark.size = res.value as number;
    }).catch(() => 1.0);
  } else {
    ssr.props.watermark = { state: false };
  }

  return ssr;
}

export default function Home(props: any) {
  const selectedArticle = useStore((state) => state.selectedArticle);
  const router = useRouter();
  const { logout } = useLogout();
  const user = useUser();

  const handleAddArticle = () => {
    router.push('/article/new');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleLogout = () => {
    logout();
    router.reload();
  };

  return (
    <>
      <Head>
        <title>Главная</title>
      </Head>
      <Stack direction="column" justifyContent="center" alignItems="center" className={IndexStyles.rootContainer}>
        <Stack direction="row" className={IndexStyles.container} gap={16}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="left"
            className={IndexStyles.leftColumn}
          >
            <img
              alt="logo"
              src="/logo.png"
              className={IndexStyles.logo}
            />
            <ArticlesList />
            { user != null && user.admin ? (
              <>
                <IndexButton onClick={handleAddArticle}>
                  <NoteAddRoundedIcon />
                  Добавить статью
                </IndexButton>
                <IndexButton onClick={handleSettings}>
                  <SettingsRoundedIcon />
                  Настройки
                </IndexButton>
              </>
            )
              : null}
            { user
              ? (
                <IndexButton onClick={handleLogout}>
                  <LogoutRoundedIcon />
                  Выйти
                </IndexButton>
              )
              : null}

          </Stack>
          {selectedArticle
            ? (
              <ArticleDetail
                key={`detail${selectedArticle}`}
                id={selectedArticle}
                watermark={props.watermark}
                className={IndexStyles.detail}
              />
            ) : null}

        </Stack>
      </Stack>
    </>
  );
}
