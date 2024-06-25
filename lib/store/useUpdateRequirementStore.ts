import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Layananform {
  id: number;
  field: string;
  tipedata:
    | "text"
    | "number"
    | "radio"
    | "checkbox"
    | "date"
    | "textarea"
    | "string";
  datajson: any | null;
  isrequired: string;
}

interface LayananStore {
  layananforms: Layananform[];
  serviceId: number;
  dataStep2: Step2[];
  setDataStep2: (data: Step2[]) => void;
  dataStep3: Step3[];
  setDataStep3: (data: Step3[]) => void;
  setLayananforms: (data: Layananform[]) => void;
  setServiceId: (id: number) => void;
}

interface OptionType {
  id: number;
  key: string;
}

interface Step2 {
  id?: any;
  field: string;
  tipedata:
    | "text"
    | "number"
    | "radio"
    | "checkbox"
    | "date"
    | "textarea"
    | "string";
  isrequired: string;
  options?: OptionType[];
}

interface Step3 {
  field: string;
  tipedata: string;
  isrequired: number;
}

const useUpdateRequirementStore = create<LayananStore>()(
  persist(
    (set) => ({
      layananforms: [],
      serviceId: 0,
      dataStep2: [],
      setDataStep2: (data: Step2[]) => set({ dataStep2: data }),
      dataStep3: [],
      setDataStep3: (data: Step3[]) => set({ dataStep3: data }),
      setLayananforms: (data: any) => set({ layananforms: data }),
      setServiceId: (id: number) => set({ serviceId: id }),
    }),
    {
      name: "requirement-update",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUpdateRequirementStore;
