import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center">
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/60 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="mt-4 font-display text-xl font-extrabold uppercase">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
