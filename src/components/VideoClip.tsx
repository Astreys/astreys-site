import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { Clip } from '../content/spotting';
import { formatDate } from '../lib/format';
import styles from './VideoClip.module.css';

/**
 * A poster that becomes a video when asked.
 *
 * A <video poster> downloads its poster at page load and cannot be lazy, which
 * cost phones ~0.4s of LCP on the Spotting page. Instead the clip starts as a
 * lazy-loaded image inside a link to the MP4:
 *
 * - without JavaScript, the link opens the clip in the browser's own player;
 * - with it, a click swaps in a native <video controls> and starts playback.
 *
 * Nothing autoplays, and no video bytes move until the visitor asks (§6.3).
 */
export function VideoClip({ clip }: { clip: Clip }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = `/media/${clip.id}.mp4`;
  const poster = `/media/${clip.id}-poster.jpg`;
  const captionId = `${clip.id}-caption`;

  useEffect(() => {
    // Keep keyboard focus on the thing the visitor just activated.
    if (playing) videoRef.current?.focus();
  }, [playing]);

  const play = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, download) do what the visitor asked.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setPlaying(true);
  };

  return (
    <figure className={styles.clip}>
      {playing ? (
        <video
          ref={videoRef}
          className={styles.media}
          controls
          autoPlay
          playsInline
          poster={poster}
          width={clip.width}
          height={clip.height}
          aria-describedby={captionId}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <a href={src} type="video/mp4" className={styles.facade} onClick={play} aria-describedby={captionId}>
          <img
            className={styles.media}
            src={poster}
            width={clip.width}
            height={clip.height}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className={styles.play}>
            Play <span className="visuallyHidden">video: {clip.title}, </span>
            <span className={styles.duration}>0:{String(clip.durationSeconds).padStart(2, '0')}</span>
          </span>
        </a>
      )}
      <figcaption id={captionId} className={styles.caption}>
        <span className={styles.title}>{clip.title}</span> {clip.description}{' '}
        <span className={styles.meta}>
          {clip.airport}, {formatDate(clip.date)}. {clip.durationSeconds} seconds, no sound.
        </span>
      </figcaption>
    </figure>
  );
}
