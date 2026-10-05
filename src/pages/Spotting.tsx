import { Link } from 'react-router';
import { ExternalLink } from '../components/ExternalLink';
import { Picture } from '../components/Picture';
import { VideoClip } from '../components/VideoClip';
import { projects } from '../content/projects';
import { bannerPhotoId, clips, photos, type Photo } from '../content/spotting';
import { formatDate } from '../lib/format';
import page from './Page.module.css';
import styles from './Spotting.module.css';

const BANNER_SIZES = '(min-width: 76rem) 76rem, 100vw';
const FEATURE_SIZES = '(min-width: 76rem) 76rem, calc(100vw - 2rem)';
const GRID_SIZES = '(min-width: 76rem) 37rem, (min-width: 48rem) calc(50vw - 2rem), calc(100vw - 2rem)';

function caption(photo: Photo): string {
  const subject = [photo.airline, photo.aircraft].filter(Boolean).join(' ');
  const registration = photo.registration ? ` ${photo.registration}` : '';
  return `${subject}${registration}. ${photo.airport}, ${formatDate(photo.date)}.`;
}

export function Spotting() {
  const banner = photos.find((photo) => photo.id === bannerPhotoId);
  const gallery = photos.filter((photo) => photo.id !== bannerPhotoId);
  const planeSpotter = projects.find((project) => project.id === 'plane-spotter-board');

  return (
    <>
      <header className={styles.banner}>
        {banner && (
          <Picture id={banner.id} alt={banner.alt} sizes={BANNER_SIZES} priority className={styles.bannerImage} />
        )}
        <div className={styles.bannerText}>
          <p className={`eyebrow ${styles.bannerEyebrow}`}>Plane spotting</p>
          <h1 className={styles.bannerTitle}>Spotting</h1>
          <p className={styles.bannerSub}>Toronto Pearson · YYZ</p>
        </div>
        {banner && <p className={styles.bannerCredit}>{caption(banner)}</p>}
      </header>

      <div className={styles.intro}>
        <p className={styles.lede}>
          I photograph aircraft around Toronto Pearson. It is where most of my spare time goes, and it is why{' '}
          <Link to="/work#plane-spotter-board">Plane Spotter Board</Link> exists: the hardest part of spotting is
          knowing when something worth seeing is about to land.
        </p>

        {planeSpotter && (
          <aside className={styles.live} aria-labelledby="live-heading">
            <h2 id="live-heading" className={styles.liveTitle}>
              What’s landing right now?
            </h2>
            <p className={styles.liveText}>The board I built shows aircraft on approach to Pearson, live.</p>
            <ExternalLink href={planeSpotter.url} className="arrowLink">
              Open Plane Spotter Board
            </ExternalLink>
          </aside>
        )}
      </div>

      <section className={page.section} aria-labelledby="photos-heading">
        <div className={page.sectionHead}>
          <h2 id="photos-heading" className={page.sectionTitle}>
            Photographs
          </h2>
        </div>
        <ul className={styles.gallery}>
          {gallery.map((photo) => (
            <li key={photo.id} className={photo.layout ? styles[photo.layout] : undefined}>
              <figure className={styles.photo}>
                <div className={styles.frame}>
                  <Picture id={photo.id} alt={photo.alt} sizes={photo.layout === 'wide' ? FEATURE_SIZES : GRID_SIZES} />
                </div>
                <figcaption className={styles.caption}>
                  {caption(photo)}
                  {photo.note && <span className={page.meta}> {photo.note}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className={page.section} aria-labelledby="clips-heading">
        <div className={page.sectionHead}>
          <h2 id="clips-heading" className={page.sectionTitle}>
            Clips
          </h2>
        </div>
        <div className={styles.clips}>
          {clips.map((clip) => (
            <VideoClip key={clip.id} clip={clip} />
          ))}
        </div>
      </section>
    </>
  );
}
