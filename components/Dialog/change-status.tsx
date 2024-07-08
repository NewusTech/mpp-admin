import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import useQueueStore from "@/lib/store/useQueueStore";

export function AlertDialogChangeStatus() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { switchValues } = useQueueStore();
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleSubmit = async () => {
    console.log(switchValues);
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="py-1 px-4 bg-primary-700 hover:bg-primary-800 cursor-pointer"
        >
          Submit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center w-96 justify-center border-0 rounded-[20px] overflow-auto gap-y-10">
        <Image src="/icons/info.svg" alt="info" height={50} width={50} />
        <h4 className="text-neutral-800 text-sm text-center w-[213px]">
          Apakah kamu yakin ingin mengubah status layanan?
        </h4>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-success-700 hover:bg-success-800 text-neutral-50 rounded-full px-[37px]"
          >
            YA
          </AlertDialogAction>
          <AlertDialogCancel
            type="button"
            onClick={handleAddModalClose}
            className="bg-primary-700 hover:bg-primary-800 text-neutral-50 hover:text-neutral-50 rounded-full px-[37px]"
          >
            BATAL
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
