import React, { useEffect, useState } from "react";
import useQueueStore from "@/lib/store/useQueueStore";
import { Switch } from "@/components/ui/switch";

interface ActiveProps {
  id: number;
  status: boolean;
  type: string;
}

const SwitchActive = ({ id, status, type }: ActiveProps) => {
  const { setSwitchValue } = useQueueStore();
  const [checked, setChecked] = useState(status);

  useEffect(() => {
    setSwitchValue(id, type, status);
  }, [id, status, type, setSwitchValue]);

  const handleChange = (checked: boolean) => {
    setChecked(checked); // Update nilai checked saat switch diubah
    setSwitchValue(id, type, checked); // Simpan perubahan ke dalam store
  };

  return (
    <Switch
      id={`${type}-${id}`}
      checked={checked}
      defaultChecked={status}
      onCheckedChange={handleChange}
    />
  );
};

export default SwitchActive;
