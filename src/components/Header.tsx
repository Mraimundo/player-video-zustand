import { useCurrentLesson } from "../hooks/useCurrentLesson";
import { usePlayerStore } from "../store/player";

export function Header() {
  const { currentModule, currentLesson } = useCurrentLesson();
  const isCourseLoading = usePlayerStore((state) => state.isLoading);

  if (isCourseLoading) {
    return <h1 className="text-2xl font-bold">Carregando...</h1>;
  }

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
      <span className="text-sm text-zinc-400">{currentModule?.title}</span>
    </div>
  );
}
