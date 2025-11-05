import { usePlayerStore } from "../store/player";

export const useCurrentLesson = () => {
  const course = usePlayerStore((state) => state.course);
  const currentModuleIndex = usePlayerStore(
    (state) => state.currentModuleIndex
  );
  const currentLessonIndex = usePlayerStore(
    (state) => state.currentLessonIndex
  );

  const currentModule = course?.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  return { currentModule, currentLesson };
};
