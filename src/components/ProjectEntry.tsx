import type { Project } from '../content/projects';
import { ExternalLink } from './ExternalLink';
import { Picture } from './Picture';
import { UrlPlaceholder } from './UrlPlaceholder';
import styles from './ProjectEntry.module.css';

const LEAD_SIZES = '(min-width: 76rem) 33rem, (min-width: 56rem) 45vw, calc(100vw - 2rem)';

export const displayUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

interface ProjectEntryProps {
  project: Project;
  /** 1-based position, shown as "01". */
  index: number;
  /** The first entry's screenshot is the page's largest paint: load it first. */
  priority?: boolean;
}

/**
 * One product on /work: screenshot on one side (pinned while the write-up
 * scrolls past on wide screens), the write-up on the other. The heading pairs
 * the name with the live URL, so the claim and the proof share a line.
 */
export function ProjectEntry({ project, index, priority = false }: ProjectEntryProps) {
  const titleId = `${project.id}-title`;
  const [lead, ...moreImages] = project.images;

  return (
    <article id={project.id} className={styles.entry} aria-labelledby={titleId}>
      <div className={styles.media}>
        <figure className={styles.figure}>
          {lead ? (
            <Picture id={lead.id} alt={lead.alt} sizes={LEAD_SIZES} priority={priority} />
          ) : (
            <UrlPlaceholder label={displayUrl(project.url)} />
          )}
        </figure>
        {moreImages.map((image) => (
          <figure key={image.id} className={styles.figure}>
            <Picture id={image.id} alt={image.alt} sizes={LEAD_SIZES} />
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <div className={styles.content}>
        <header className={styles.head}>
          <h3 id={titleId} className={styles.name}>
            <span className={styles.number} aria-hidden="true">
              {String(index).padStart(2, '0')} /
            </span>{' '}
            {project.name}
          </h3>
          <ExternalLink href={project.url} className={`arrowLink ${styles.url}`}>
            {displayUrl(project.url)}
          </ExternalLink>
        </header>

        <div className={styles.prose}>
          {project.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        {project.facts && (
          <dl className={styles.facts}>
            {project.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className={styles.stack}>
          <h4 className={styles.stackLabel}>Stack</h4>
          <ul className="chips">
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {(project.links?.length ?? 0) > 0 && (
          <ul className={styles.links}>
            {project.links?.map((link) => (
              <li key={link.url}>
                <ExternalLink href={link.url} className="arrowLink">
                  {link.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        )}

        {project.note && <p className={styles.note}>{project.note}</p>}
      </div>
    </article>
  );
}
