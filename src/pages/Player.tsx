import { useEffect } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { Header } from "../components/Header";
import { Module } from "../components/Module";
import { Video } from "../components/Video";
import { usePlayerStore } from "../store/player";
import { useCurrentLesson } from "../hooks/useCurrentLesson";
import { useMediaQuery } from "../hooks/useMediaQuery";

export function Player() {
  const modules = usePlayerStore((state) => state.course?.modules);
  const resetProgress = usePlayerStore((state) => state.resetProgress);
  const isLoading = usePlayerStore((state) => state.isLoading);
  const { currentLesson } = useCurrentLesson();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const state = usePlayerStore.getState();
    if (!state.course && typeof state.load === "function") {
      state.load();
    }
  }, []);

  useEffect(() => {
    document.title = currentLesson?.title ?? "Carregando curso...";
  }, [currentLesson]);

  const renderModules = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-zinc-400 text-sm p-4">
          Carregando módulos...
        </div>
      );
    }

    if (!modules || modules.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-zinc-500 text-sm p-4">
          Nenhum módulo encontrado.
        </div>
      );
    }

    return (
      <ul className="flex flex-col">
        {modules.map((module, index) => (
          <li key={module.id}>
            <Module
              moduleIndex={index}
              title={module.title}
              amountOfLesson={module.lessons.length}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-start justify-center p-4">
      <div className="w-full max-w-[1100px] flex flex-col gap-6">
        <header className="flex items-center gap-4 flex-col sm:flex-row justify-between">
          <Header />
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={resetProgress}
              className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar curso</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded bg-violet-500 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Deixar feedback</span>
            </button>
          </div>
        </header>

        <main className="relative flex flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow">
          {isDesktop ? (
            <>
              <section className="flex-1 min-w-0" aria-label="Player de vídeo">
                <Video />
              </section>

              <aside
                className="w-80 border-l border-zinc-800 bg-zinc-900"
                aria-label="Lista de módulos e aulas"
              >
                <div className="h-full overflow-y-auto px-0 py-4">
                  {renderModules()}
                </div>
              </aside>
            </>
          ) : (
            <div className="flex flex-col w-full">
              <div className="sticky top-0 z-10 bg-zinc-900">
                <Video />
              </div>

              <div className="flex-1 overflow-y-auto mt-2 p-2">
                {renderModules()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
