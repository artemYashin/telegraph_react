import Styles from '@/styles/Divider.module.css';
import ArticleSection from './ArticleSection';

const Divider = ArticleSection(() => (
  <div className={Styles.divider} />
));

export default Divider;
