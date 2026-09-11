import { useState, useCallback, useId } from "react";
import { Youtube, AlertTriangle, ExternalLink, Play } from "lucide-react";

type Props = {
  videoId: string;
  startTime?: number;
  title?: string;
  className?: string;
};

/**
 * Lazy-loaded YouTube embed player.
 * Renders a clickable thumbnail first, loads the iframe on interaction.
 * Handles error states (unavailable / embedding disabled).
 */
export function YouTubePlayer({ videoId, startTime = 0, title = "Video", className = "" }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const iframeId = useId();

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const startParam = Math.max(0, Math.floor(startTime));
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?start=${startParam}&rel=0&modestbranding=1&enablejsapi=1&autoplay=1`;
  const youtubeUrl = `https://youtu.be/${videoId}?t=${startParam}`;

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  if (!videoId) {
    return (
      <div className={`flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface/20 ${className}`}>
        <div className="text-center px-4">
          <Youtube className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            No video available for this course yet.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-surface/20 ${className}`}>
        <div className="text-center px-6">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            Video cannot be played inside the app
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This may be because embedding is disabled by the creator, or the video is unavailable.
          </p>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open on YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-border bg-background ${className}`}>
      <div className="relative aspect-video w-full">
        {!loaded ? (
          <button
            type="button"
            onClick={handleLoad}
            className="group absolute inset-0 flex items-center justify-center bg-black/5 transition-colors hover:bg-black/10"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={() => {
                // Thumbnail failed — still allow loading the iframe
              }}
            />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
              <Play className="h-7 w-7 fill-primary-foreground text-primary-foreground ml-1" />
            </div>
          </button>
        ) : (
          <iframe
            id={iframeId}
            src={embedUrl}
            title={title}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}
