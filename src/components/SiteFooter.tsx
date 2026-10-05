import { profile } from '../content/profile';
import { ExternalLink } from './ExternalLink';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contact}>
        <h2 className={styles.heading}>Let’s talk</h2>
        <p className={styles.lede}>
          {profile.availability} The quickest way to reach me is email.
        </p>
        <a href={`mailto:${profile.email}`} className={styles.email}>
          {profile.email}
        </a>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.links}>
          <li>
            <ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink>
          </li>
          <li>
            <ExternalLink href={profile.github}>GitHub</ExternalLink>
          </li>
          <li>
            <a href={profile.resume.href} type="application/pdf">
              Résumé <span className={styles.meta}>(PDF, {profile.resume.sizeKb} KB)</span>
            </a>
          </li>
          <li>
            <ExternalLink href={profile.sourceRepo}>Source for this site</ExternalLink>
          </li>
        </ul>
        <p className={styles.meta}>
          {profile.name} · {profile.location}, Ontario
        </p>
      </div>
    </footer>
  );
}
