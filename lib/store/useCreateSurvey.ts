// store.js
import { create } from "zustand";

interface InputType {
  field: string;
}

interface CreateSurveyProps {
  selectedId: number;
  inputs: InputType[];
  setSelectedId: (id: number) => void;
  setInputs: (data: InputType[]) => void;
}

const useCreateSurvey = create<CreateSurveyProps>((set) => ({
  selectedId: 0,
  inputs: [],
  setSelectedId: (id: number) => set({ selectedId: id }),
  setInputs: (data: InputType[]) => set({ inputs: data }),
}));

export default useCreateSurvey;
