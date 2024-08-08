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
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";

export function AlertDialogChangeStatus() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { switchValues } = useQueueStore();
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/updatestatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(switchValues),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        handleAddModalClose();
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
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
}
