import { Link } from "@tanstack/react-router";
import { Rocket, X, ArrowRight } from "lucide-react";
import { useLatestUnseenRelease, markReleaseSeen } from "@/lib/releaseNotes";

/**
 * Bottom-right "what's new" balloon. Unlike the old action-less "refresh" toast, it names
 * the actual change and links straight to the Release notes page. Shown once per visitor
 * per release: dismissing (X) or opening the page marks it seen (localStorage).
 */
export function ReleaseBalloon() {
  const note = useLatestUnseenRelease();
  if (!note) return null;
  const dismiss = () => markReleaseSeen(note.id);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-neutral-900 p-4 text-white shadow-2xl">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="absolute right-3 top-3 rounded-md p-0.5 text-white/50 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 pr-6">
        <Rocket className="h-4 w-4 shrink-0 text-violet-400" />
        <p className="text-sm font-semibold leading-snug">
          A new version of{" "}
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            Shalion Console
          </span>{" "}
          is out ✨
        </p>
      </div>
      <p className="mt-1.5 text-sm leading-snug text-white/70">{note.title}.</p>
      <Link
        to="/release-notes"
        onClick={dismiss}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
      >
        See the latest changes! <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
