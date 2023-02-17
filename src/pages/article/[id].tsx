import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArticleDetail from '@/components/ArticleDetail';
import Styles from '@/styles/ArticleDetailPage.module.css';

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const handleBackButton = () => {
    router.back();
  };

  return (
    <div className={Styles.root}>
      <Button
        onClick={handleBackButton}
        className={Styles.back_button}
      >
        <ArrowBackIosRoundedIcon sx={{ width: 15, marginTop: '-2px' }} />
        Назад
      </Button>
      <div className={Styles.container}>
        <ArticleDetail id={Number(id)} />
      </div>
    </div>
  );
}
