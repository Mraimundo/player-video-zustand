import { PlayCircle, Video as VideoIcon } from "lucide-react";

interface LessonProps {
  title: string;
  duration: string;
  onPlay: () => void;
  isCurrent?: boolean;
}

export function Lesson({
  title,
  duration,
  onPlay,
  isCurrent = false,
}: LessonProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onPlay}
        disabled={isCurrent}
        aria-current={isCurrent ? "true" : undefined}
        className="w-full flex items-center gap-3 text-sm text-zinc-400
                   hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500
                   disabled:opacity-60 disabled:cursor-default transition-colors duration-150"
        title={title}
      >
        {isCurrent ? (
          <PlayCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        ) : (
          <VideoIcon className="w-4 h-4 text-zinc-500" aria-hidden="true" />
        )}

        <span className="truncate">{title}</span>

        <span className="ml-auto font-mono text-xs text-zinc-500">
          {duration}
        </span>
      </button>
    </div>
  );
}
