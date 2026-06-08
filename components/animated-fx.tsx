import { cn } from "@/lib/utils";

/** A flickering wood-fire flame built from layered SVG paths. */
export function Flame({ className }: { className?: string }) {
  return (
    <div className={cn("animate-flame", className)} aria-hidden>
      <svg viewBox="0 0 64 96" className="h-full w-full">
        <defs>
          <linearGradient id="flame-outer" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.58 0.21 27)" />
            <stop offset="60%" stopColor="oklch(0.66 0.23 38)" />
            <stop offset="100%" stopColor="oklch(0.82 0.16 78)" />
          </linearGradient>
          <linearGradient id="flame-inner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.82 0.16 78)" />
            <stop offset="100%" stopColor="oklch(0.95 0.05 95)" />
          </linearGradient>
        </defs>
        <path
          d="M32 4C20 24 8 34 8 56a24 24 0 0 0 48 0c0-14-8-22-14-32-3 6-2 12-6 14-5-3-3-16-4-34Z"
          fill="url(#flame-outer)"
        />
        <path
          d="M32 40c-7 10-12 14-12 24a12 12 0 0 0 24 0c0-8-6-12-8-18-2 3-1 6-4 8Z"
          fill="url(#flame-inner)"
        />
      </svg>
    </div>
  );
}

/** A row of rising steam wisps. */
export function Steam({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none flex items-end gap-2", className)} aria-hidden>
      {[0, 0.6, 1.2].map((delay, i) => (
        <span
          key={i}
          className="animate-steam block h-10 w-1.5 rounded-full bg-foreground/30 blur-[2px]"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
