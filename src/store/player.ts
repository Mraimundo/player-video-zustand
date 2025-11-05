import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";

interface Lesson {
  id: string;
  title: string;
  duration: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  modules: Module[];
}

export interface PlayerState {
  course: Course | null;
  currentModuleIndex: number;
  currentLessonIndex: number;
  isLoading: boolean;
  play: (moduleIndex: number, lessonIndex: number) => void;
  next: () => void;
  load: () => Promise<void>;
  resetProgress: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      course: null,
      currentModuleIndex: 0,
      currentLessonIndex: 0,
      isLoading: true,

      play: (moduleIndex, lessonIndex) =>
        set({
          currentModuleIndex: moduleIndex,
          currentLessonIndex: lessonIndex,
        }),

      next: () => {
        const { course, currentModuleIndex, currentLessonIndex } = get();
        if (!course) return;

        const currentModule = course.modules[currentModuleIndex];
        const nextLessonIndex = currentLessonIndex + 1;

        if (nextLessonIndex < currentModule.lessons.length) {
          set({ currentLessonIndex: nextLessonIndex });
          return;
        }

        const nextModuleIndex = currentModuleIndex + 1;
        if (nextModuleIndex < course.modules.length) {
          set({
            currentModuleIndex: nextModuleIndex,
            currentLessonIndex: 0,
          });
          return;
        }

        console.warn("🚀 Fim do curso!");
      },

      load: async () => {
        try {
          set({ isLoading: true });
          const { data } = await api.get<Course>("courses/1");
          set({ course: data, isLoading: false });
        } catch (error) {
          console.error("Erro ao carregar curso:", error);
          set({ isLoading: false });
        }
      },

      resetProgress: () =>
        set({
          currentModuleIndex: 0,
          currentLessonIndex: 0,
          course: null,
          isLoading: false,
        }),
    }),
    {
      name: "player-storage",
      partialize: (state) => ({
        course: state.course,
        currentModuleIndex: state.currentModuleIndex,
        currentLessonIndex: state.currentLessonIndex,
      }),
    }
  )
);
