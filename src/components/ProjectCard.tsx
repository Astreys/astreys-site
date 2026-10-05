import { Link } from 'react-router';
import type { Project } from '../content/projects';
import { Picture } from './Picture';
import { displayUrl } from './ProjectEntry';
import { UrlPlaceholder } from './UrlPlaceholder';
import styles from './ProjectCard.module.css';

const CARD_SIZES = '(min-width: 76rem) 24rem, (min-width: 48rem) 33vw, calc(100vw - 2rem)';

/**
 * The whole card is clickable through one real link (the title), stretched
 * over the card with CSS, so screen readers hear one link per project rather
 * than three.
 */
export function ProjectCard({ project }: { project: Project }) {
  const [image] = project.images;
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <Picture id={image.id} alt="" sizes={CARD_SIZES} />
        ) : (
          <UrlPlaceholder label={displayUrl(project.url)} />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={`/work#${project.id}`} className={styles.link}>
            {project.name}
          </Link>
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul className="chips" aria-label="Stack">
          {project.stack.slice(0, 4).map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
