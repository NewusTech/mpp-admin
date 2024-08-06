import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AudioStore {
  audioUrl: string | null;
  idQueue: number | null;
  setAudioUrl: (url: string | null) => void;
  setIdQueue: (id: number | null) => void;
}

const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      audioUrl: null,
      idQueue: null,
      setAudioUrl: (url: string | null) => set({ audioUrl: url }),
      setIdQueue: (id: number | null) => set({ idQueue: id }),
    }),
    {
      name: "queue",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAudioStore;
