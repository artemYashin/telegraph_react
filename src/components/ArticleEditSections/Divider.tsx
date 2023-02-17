import Styles from '@/styles/Divider.module.css';
import ArticleSection from './ArticleSection';

const Divider = ArticleSection(() => (
  <div className={Styles.divider_container}>
    <div className={Styles.divider} />
  </div>
));

export default Divider;
