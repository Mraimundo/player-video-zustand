import ReactPlayer from "react-player";
import { Loader } from "lucide-react";
import { usePlayerStore } from "../store/player";
import { useCurrentLesson } from "../hooks/useCurrentLesson";

export function Video() {
  const { currentLesson } = useCurrentLesson();
  const isLoading = usePlayerStore((state) => state.isLoading);
  const next = usePlayerStore((state) => state.next);

  const handlePlayNext = () => {
    next();
  };

  if (isLoading || !currentLesson) {
    return (
      <div
        className="flex h-full items-center justify-center bg-zinc-950 aspect-video"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader
          className="w-6 h-6 text-zinc-400 animate-spin"
          aria-hidden="true"
        />
        <span className="sr-only">Carregando vídeo</span>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-zinc-950 aspect-video"
      role="region"
      aria-label={`Player de vídeo: ${currentLesson.title}`}
    >
      <ReactPlayer
        width="100%"
        height="100%"
        controls
        playing
        onEnded={handlePlayNext}
        src={`https://www.youtube.com/watch?v=${currentLesson.id}`}
      />
    </div>
  );
}
