import Cookies from "js-cookie";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";

const ModalDelete = ({ endpoint }: { endpoint: string }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleValidationStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${endpoint}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        handleAddModalClose();
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <div
          onClick={handleOpenAddModal}
          className="py-1 px-2 w-full hover:bg-slate-100 cursor-pointer"
        >
          <p className="text-sm">Delete</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center w-96 justify-center border-0 rounded-[20px] overflow-auto gap-y-10">
        <Image src="/icons/info.svg" alt="info" height={50} width={50} />
        <h4 className="text-neutral-800 text-sm text-center w-[213px]">
          Apakah kamu yakin ingin menghapusnya?
        </h4>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleValidationStatus}
            className="bg-error-700 hover:bg-error-800 text-neutral-50 rounded-full px-[37px]"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loader className="animate-spin" /> : "YA"}
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
};

export default ModalDelete;
