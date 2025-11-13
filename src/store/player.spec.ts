import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { act } from "@testing-library/react";
import { usePlayerStore } from "../store/player";
import { api } from "../lib/axios";

vi.mock("../lib/axios", () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockCourse = {
  id: 1,
  modules: [
    {
      id: 1,
      title: "Getting Started with React",
      lessons: [
        { id: "1", title: "Redux Toolkit", duration: "13:41" },
        { id: "2", title: "Styling the Post", duration: "10:05" },
      ],
    },
    {
      id: 2,
      title: "Application Structure",
      lessons: [{ id: "3", title: "Comment Component", duration: "13:45" }],
    },
  ],
};

describe("usePlayerStore", () => {
  beforeEach(() => {
    const { resetProgress } = usePlayerStore.getState();
    resetProgress();
    vi.clearAllMocks();
  });

  it("should load a course using load()", async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: mockCourse });

    await act(async () => {
      await usePlayerStore.getState().load(1);
    });

    const { course, isLoading } = usePlayerStore.getState();

    expect(course).toEqual(mockCourse);
    expect(isLoading).toBe(false);
  });

  it("should update module and lesson indexes when play() is called", () => {
    usePlayerStore.setState({ course: mockCourse });

    act(() => {
      usePlayerStore.getState().play(0, 1);
    });

    const { currentModuleIndex, currentLessonIndex } =
      usePlayerStore.getState();

    expect(currentModuleIndex).toBe(0);
    expect(currentLessonIndex).toBe(1);
  });

  it("should move to the next lesson when next() is called", () => {
    usePlayerStore.setState({
      course: mockCourse,
      currentModuleIndex: 0,
      currentLessonIndex: 0,
    });

    act(() => {
      usePlayerStore.getState().next();
    });

    const { currentModuleIndex, currentLessonIndex } =
      usePlayerStore.getState();

    expect(currentModuleIndex).toBe(0);
    expect(currentLessonIndex).toBe(1);
  });

  it("should jump to the next module when finishing lessons in the current one", () => {
    usePlayerStore.setState({
      course: mockCourse,
      currentModuleIndex: 0,
      currentLessonIndex: 1,
    });

    act(() => {
      usePlayerStore.getState().next();
    });

    const { currentModuleIndex, currentLessonIndex } =
      usePlayerStore.getState();

    expect(currentModuleIndex).toBe(1);
    expect(currentLessonIndex).toBe(0);
  });

  it("should reset progress when resetProgress() is called", () => {
    usePlayerStore.setState({
      course: mockCourse,
      currentModuleIndex: 1,
      currentLessonIndex: 2,
      isLoading: false,
    });

    act(() => {
      usePlayerStore.getState().resetProgress();
    });

    const { currentModuleIndex, currentLessonIndex, course, isLoading } =
      usePlayerStore.getState();

    expect(currentModuleIndex).toBe(0);
    expect(currentLessonIndex).toBe(0);
    expect(course).toBeNull();
    expect(isLoading).toBe(true);
  });

  it("should handle API errors gracefully during load()", async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      await usePlayerStore.getState().load(99);
    });

    const { isLoading } = usePlayerStore.getState();

    expect(isLoading).toBe(false);
  });
});
