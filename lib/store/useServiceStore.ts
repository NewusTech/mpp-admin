// store.js
import { create } from "zustand";

interface ServiceStoreProps {
  selectedId: number;
  setSelectedId: (id: number) => void;
}

const useServiceStore = create<ServiceStoreProps>((set) => ({
  selectedId: 0,
  setSelectedId: (id: number) => set({ selectedId: id }),
}));

export default useServiceStore;
