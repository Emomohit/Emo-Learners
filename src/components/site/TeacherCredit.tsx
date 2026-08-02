import { ExternalLink, Youtube } from "lucide-react";

type Props = {
  /** Real name of the teacher in the videos */
  teacher?: string | undefined;
  /** YouTube channel name */
  channel?: string | undefined;
  /** Channel link */
  channelUrl?: string | undefined;
  /** Direct link to the source video / playlist */
  sourceUrl?: string | undefined;
  className?: string;
};

/**
 * Small credit strip that names the real teacher behind the videos,
 * their channel, and a link to the original source.
 */
export function TeacherCredit({
  teacher,
  channel,
  channelUrl,
  sourceUrl,
  className = "",
}: Props) {
  if (!teacher && !channel) return null;

  return (
    <div
      className={`panel flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-4 py-3 text-xs ${className}`}
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Youtube className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Taught by
      </span>
      <span className="min-w-0 font-semibold text-foreground">{teacher ?? channel}</span>
      {channel && (
        <>
          <span className="text-muted-foreground">·</span>
          {channelUrl ? (
            <a
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {channel}
            </a>
          ) : (
            <span className="text-muted-foreground">{channel}</span>
          )}
        </>
      )}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1 font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          Watch source <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
