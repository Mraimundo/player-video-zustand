import { useCurrentLesson } from "../hooks/useCurrentLesson";
import { usePlayerStore } from "../store/player";

export function Header() {
  const { currentModule, currentLesson } = useCurrentLesson();
  const isCourseLoading = usePlayerStore((state) => state.isLoading);

  if (isCourseLoading) {
    return (
      <header
        aria-live="polite"
        aria-busy="true"
        className="flex flex-col gap-1"
      >
        <h1 className="text-2xl font-bold">Carregando...</h1>
      </header>
    );
  }

  return (
    <header className="flex  flex-col gap-1">
      <h1 className="text-2xl font-bold truncate" title={currentLesson?.title}>
        {currentLesson?.title ?? "Aula indisponível"}
      </h1>
      <span
        className="text-sm text-zinc-400 truncate"
        title={currentModule?.title}
      >
        {currentModule?.title}
      </span>
    </header>
  );
}
