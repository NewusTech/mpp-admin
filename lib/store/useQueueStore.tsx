import { create } from "zustand";

interface SwitchValue {
  id: number;
  active_online: boolean;
  active_offline: boolean;
}

interface QueueStoreProps {
  switchValues: SwitchValue[];
  setSwitchValue: (id: number, type: string, value: boolean) => void;
}

const useQueueStore = create<QueueStoreProps>((set) => ({
  switchValues: [],
  setSwitchValue: (id, type, value) =>
    set((state) => {
      const existingIndex = state.switchValues.findIndex(
        (item) => item.id === id,
      );
      if (existingIndex !== -1) {
        const updatedItem = {
          ...state.switchValues[existingIndex],
          [type]: value,
        };
        state.switchValues[existingIndex] = updatedItem;
      } else {
        const newItem = {
          id,
          active_online: false,
          active_offline: false,
          [type]: value,
        };
        state.switchValues.push(newItem);
      }
      return { switchValues: [...state.switchValues] };
    }),
}));

export default useQueueStore;
