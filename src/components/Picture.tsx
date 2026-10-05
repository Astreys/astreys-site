import { media, type MediaId } from '../content/media.generated';

interface PictureProps {
  id: MediaId;
  alt: string;
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string;
  /** Above the fold: load now rather than on scroll. */
  eager?: boolean;
  /** The page's largest paint: load now, ahead of other images. */
  priority?: boolean;
  className?: string | undefined;
}

/**
 * AVIF with a JPEG fallback, at every width the media script produced, with
 * intrinsic width/height so the layout never shifts as images arrive.
 */
export function Picture({ id, alt, sizes, eager = false, priority = false, className }: PictureProps) {
  const { width, height, widths } = media[id];
  const srcSet = (ext: string) => widths.map((w) => `/media/${id}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src={`/media/${id}-${widths.at(-1) ?? width}.jpg`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={eager || priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  );
}
