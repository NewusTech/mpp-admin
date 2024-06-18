// store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OptionType {
  id: number;
  key: string;
}

interface Step2 {
  id?: any;
  field: string;
  tipedata: "text" | "number" | "radio" | "checkbox" | "date";
  isrequired: string;
  options?: OptionType[];
}

interface Step3 {
  field: string;
  tipedata: string;
  isrequired: number;
}

interface CreateRequirementProps {
  selectedId: number;
  setSelectedId: (id: number) => void;
  informationService: string;
  setInformationService: (desc: string) => void;
  serviceId: number;
  setServiceId: (id: number) => void;
  dataStep2: Step2[];
  setDataStep2: (data: Step2[]) => void;
  dataStep3: Step3[];
  setDataStep3: (data: Step3[]) => void;
}

const useCreateRequirement = create<CreateRequirementProps>()(
  persist(
    (set) => ({
      selectedId: 0,
      setSelectedId: (id: number) => set({ selectedId: id }),
      informationService: "",
      setInformationService: (desc: string) =>
        set({ informationService: desc }),
      serviceId: 0,
      setServiceId: (id: number) => set({ serviceId: id }),
      dataStep2: [],
      setDataStep2: (data: Step2[]) => set({ dataStep2: data }),
      dataStep3: [],
      setDataStep3: (data: Step3[]) => set({ dataStep3: data }),
    }),
    {
      name: "requirement",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCreateRequirement;
