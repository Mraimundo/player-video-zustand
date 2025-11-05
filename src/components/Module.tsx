import { ChevronDown } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Lesson } from "./Lesson";
import { usePlayerStore } from "../store/player";
import { SkeletonScreen } from "./SkeletonScreen";

interface ModuleProps {
  moduleIndex: number;
  title: string;
  amountOfLesson: number;
}

export function Module({ moduleIndex, title, amountOfLesson }: ModuleProps) {
  const isLoading = usePlayerStore((state) => state.isLoading);
  const course = usePlayerStore((state) => state.course);
  const play = usePlayerStore((state) => state.play);
  const currentModuleIndex = usePlayerStore(
    (state) => state.currentModuleIndex
  );
  const currentLessonIndex = usePlayerStore(
    (state) => state.currentLessonIndex
  );
  const lessons = course?.modules[moduleIndex]?.lessons ?? [];

  if (isLoading) return <SkeletonScreen />;

  return (
    <Collapsible.Root
      className="group border-b border-zinc-800"
      defaultOpen={moduleIndex === 0}
    >
      <Collapsible.Trigger
        className="flex w-full items-center gap-3 bg-zinc-900/60 p-4 
                   hover:bg-zinc-900 transition-colors duration-200"
      >
        <span
          className={`flex w-10 h-10 rounded-full items-center justify-center text-xs font-medium 
                      ${
                        currentModuleIndex === moduleIndex
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
        >
          {moduleIndex + 1}
        </span>

        <div className="flex flex-col text-left">
          <strong className="text-sm text-zinc-100">{title}</strong>
          <span className="text-xs text-zinc-500">
            {amountOfLesson} {amountOfLesson === 1 ? "aula" : "aulas"}
          </span>
        </div>

        <ChevronDown
          className="w-5 h-5 ml-auto text-zinc-400 
                     transition-transform duration-300 group-data-[state=open]:rotate-180"
        />
      </Collapsible.Trigger>

      <Collapsible.Content>
        <nav className="flex flex-col gap-3 px-6 py-4 bg-zinc-950/60">
          {lessons.map((lesson, lessonIndex) => {
            const isCurrent =
              currentModuleIndex === moduleIndex &&
              currentLessonIndex === lessonIndex;

            const handlePlay = () => {
              if (!isCurrent) play(moduleIndex, lessonIndex);
            };

            return (
              <Lesson
                key={lesson.id}
                title={lesson.title}
                duration={lesson.duration}
                isCurrent={isCurrent}
                onPlay={handlePlay}
              />
            );
          })}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
