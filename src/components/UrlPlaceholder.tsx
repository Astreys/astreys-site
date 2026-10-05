import styles from './UrlPlaceholder.module.css';

/**
 * Stands in for a screenshot a project deliberately doesn't have
 * (see docs/decisions.md). Decorative: the address is a real link nearby.
 */
export function UrlPlaceholder({ label }: { label: string }) {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      {label}
    </div>
  );
}
