// store.js
import { create } from "zustand";

interface NewsStoreProps {
  selectedId: number;
  setSelectedId: (id: number) => void;
}

const useNewsStore = create<NewsStoreProps>((set) => ({
  selectedId: 0,
  setSelectedId: (id: number) => set({ selectedId: id }),
}));

export default useNewsStore;
