import { useEffect } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { Header } from "../components/Header";
import { Module } from "../components/Module";
import { Video } from "../components/Video";
import { usePlayerStore } from "../store/player";
import { useCurrentLesson } from "../hooks/useCurrentLesson";

export function Player() {
  const { currentLesson } = useCurrentLesson();
  const modules = usePlayerStore((state) => state.course?.modules);
  const resetProgress = usePlayerStore((state) => state.resetProgress);
  const isLoading = usePlayerStore((state) => state.isLoading);

  useEffect(() => {
    const state = usePlayerStore.getState();
    if (!state.course) state.load();
  }, []);

  useEffect(() => {
    if (currentLesson) {
      document.title = currentLesson.title;
    }
  }, [currentLesson]);

  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 flex justify-center items-center">
      <div className="flex w-[1100px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <Header />

          <div className="flex gap-2">
            <button
              onClick={resetProgress}
              className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar curso
            </button>

            <button className="flex items-center gap-2 rounded bg-violet-500 px-3 py-3 text-sm font-medium text-white hover:bg-violet-700 transition">
              <MessageCircle className="w-4 h-4" />
              Deixar feedback
            </button>
          </div>
        </div>

        <main className="relative flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow pr-80">
          <div className="flex-1">
            <Video />
          </div>

          <aside className="w-80 absolute top-0 bottom-0 right-0 divide-y-2 divide-zinc-900 border-l border-zinc-800 bg-zinc-900 overflow-y-scroll scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
            {isLoading && !modules ? (
              <div className="flex items-center justify-center h-full text-zinc-400 text-sm p-4">
                Carregando módulos...
              </div>
            ) : (
              modules?.map((module, index) => (
                <Module
                  key={module.id}
                  moduleIndex={index}
                  title={module.title}
                  amountOfLesson={module.lessons.length}
                />
              ))
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
