// store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CreateRequestOfflineProps {
  serviceId: number;
  setServiceId: (id: number) => void;
}

const useCreateRequestOffline = create<CreateRequestOfflineProps>()(
  persist(
    (set) => ({
      serviceId: 0,
      setServiceId: (id: number) => set({ serviceId: id }),
    }),
    {
      name: "requestOffline",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCreateRequestOffline;
