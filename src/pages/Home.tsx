import { Link } from 'react-router';
import { Picture } from '../components/Picture';
import { ProjectCard } from '../components/ProjectCard';
import { introduction, profile } from '../content/profile';
import { projects } from '../content/projects';
import page from './Page.module.css';
import styles from './Home.module.css';

const HERO_SIZES = '(min-width: 76rem) 38rem, (min-width: 56rem) 50vw, calc(100vw - 2rem)';

export function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroText}>
          <p className="eyebrow">Front-end developer · Toronto</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            Turning ideas into <span className={styles.accent}>engaging</span> web experiences. 
          </h1>
          <p className={styles.heroLede}>
            I’m {profile.name}, a {profile.role.toLowerCase()} with fifteen years of React, TypeScript and accessible,
            consumer-facing interfaces — most of them in banking.
          </p>
          <p className={styles.stackLine}>
            <span className="visuallyHidden">Main stack: </span>React · Vue · TypeScript · JavaScript · Node.js
          </p>
          <div className={styles.actions}>
            <Link to="/work" className="button">
              View my work <span aria-hidden="true">→</span>
            </Link>
            <Link to="/#about" className="button buttonSecondary">
              About me
            </Link>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <Picture
            id="hero-toronto-dusk"
            alt="Illustration (AI-generated): an airliner’s wing over the Toronto skyline and the CN Tower at sunset."
            sizes={HERO_SIZES}
            priority
          />
        </div>
      </section>

      <section className={page.section} aria-labelledby="featured-heading">
        <div className={page.sectionHead}>
          <h2 id="featured-heading" className={page.sectionTitle}>
            Featured work
          </h2>
          <Link to="/work" className="arrowLink">
            View all projects
          </Link>
        </div>
        <ul className={styles.cards}>
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className={`${page.section} ${styles.about}`} aria-labelledby="about-heading">
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about-heading" className={styles.aboutTitle}>
            How I work
          </h2>
        </div>
        <div className={styles.aboutBody}>
          <div className={page.prose}>
            {introduction.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.availability}>
            <h3 className={styles.availabilityTitle}>Availability</h3>
            <p>{profile.availability}</p>
            <div className={styles.actions}>
              <a href={profile.resume.href} type="application/pdf" className="button">
                Download résumé <span className={styles.fileMeta}>(PDF, {profile.resume.sizeKb} KB)</span>
              </a>
              <a href={`mailto:${profile.email}`} className="button buttonSecondary">
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
