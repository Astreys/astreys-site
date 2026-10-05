import { Link } from 'react-router';
import styles from './Page.module.css';

/**
 * Rendered for any unknown path, and pre-rendered as 404.html, which Netlify
 * serves with a real 404 status. It never echoes the requested URL back.
 */
export function NotFound() {
  return (
    <header className={styles.pageHead}>
      <div className={styles.pageHeadMain}>
        <p className="eyebrow">Error 404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.lede}>There is nothing at this address. It may have moved, or the link may have a typo.</p>
        <p>
          Try the <Link to="/">home page</Link>, or go straight to <Link to="/work">my work</Link>.
        </p>
      </div>
    </header>
  );
}
