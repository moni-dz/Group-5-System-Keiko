import { create } from "zustand";

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  initialTime: number;
  setTimeLeft: (time: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setInitialTime: (time: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  timeLeft: 60,
  isRunning: false,
  initialTime: 60,

  setTimeLeft: (time) => set({ timeLeft: time }),

  startTimer: () => set({ isRunning: true }),

  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () =>
    set((state) => ({
      timeLeft: state.initialTime,
      isRunning: false,
    })),

  setInitialTime: (time) =>
    set({
      initialTime: time,
      timeLeft: time,
    }),
}));
