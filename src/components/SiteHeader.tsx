import { Link, NavLink } from 'react-router';
import { profile } from '../content/profile';
import styles from './SiteHeader.module.css';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/work', label: 'Work', end: false },
  { to: '/spotting', label: 'Spotting', end: false },
] as const;

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        SASHA<span className={styles.dot}>.</span>C<span className="visuallyHidden"> — {profile.name}, home</span>
      </Link>
      <nav aria-label="Main">
        <ul className={styles.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              {/* NavLink's className can't be undefined; CSS Module keys are
                  typed as possibly undefined under noUncheckedIndexedAccess. */}
              <NavLink to={item.to} end={item.end} className={styles.link ?? ''}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            {/* A section of the home page, so never marked as the current page. */}
            <Link to="/#about" className={styles.link}>
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
