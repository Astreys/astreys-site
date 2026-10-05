import { ProjectEntry } from '../components/ProjectEntry';
import { employmentIntro, roles } from '../content/employment';
import { projects } from '../content/projects';
import { formatMonth } from '../lib/format';
import styles from './Page.module.css';

export function Work() {
  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.pageHeadMain}>
          <p className="eyebrow">Selected projects</p>
          <h1 className={styles.title}>My work</h1>
        </div>
        <p className={styles.tagline}>
          Three products I built end to end, each one click from its live version — then fifteen years of
          employment, described in words, because that work belongs to the companies I did it for.
        </p>
      </header>

      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="visuallyHidden">
          Products I built end to end
        </h2>
        {projects.map((project, index) => (
          <ProjectEntry key={project.id} project={project} index={index + 1} priority={index === 0} />
        ))}
      </section>

      <section className={styles.section} aria-labelledby="employment-heading">
        <div className={styles.split}>
          <div>
            <p className="eyebrow">Experience</p>
            <h2 id="employment-heading" className={styles.splitTitle}>
              In employment
            </h2>
          </div>
          <div className={styles.splitBody}>
            <div className={styles.prose}>
              {employmentIntro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <ol className={styles.roles}>
              {roles.map((role) => (
                <li key={`${role.company}-${role.start}`} className={styles.role}>
                  <h3 className={styles.roleCompany}>{role.company}</h3>
                  <p className={styles.roleMeta}>
                    {role.title} · <time dateTime={role.start}>{formatMonth(role.start)}</time> –{' '}
                    {role.end ? <time dateTime={role.end}>{formatMonth(role.end)}</time> : 'present'}
                  </p>
                  <p className={styles.roleSummary}>{role.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
