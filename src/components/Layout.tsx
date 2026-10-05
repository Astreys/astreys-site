import { Outlet } from 'react-router';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { useRouteChange } from '../lib/useRouteChange';
import styles from './Layout.module.css';

export function Layout() {
  useRouteChange();

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
