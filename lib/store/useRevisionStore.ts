import { create } from "zustand";

interface RevisionStore {
  countRevision: number;
  countFixed: number;
  setCountRevision: (count: number) => void;
  setCountFixed: (count: number) => void;
}

const useRevisionStore = create<RevisionStore>((set) => ({
  countRevision: 0,
  countFixed: 0,
  setCountRevision: (count) => set({ countRevision: count }),
  setCountFixed: (count) => set({ countFixed: count }),
}));

export default useRevisionStore;
