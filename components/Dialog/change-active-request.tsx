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
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader, X } from "lucide-react";
import { mutate } from "swr";

export function AlertDialogChangeStatusRequest({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNonactive, setIsLoadingNonactive] = useState(false);

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
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/activeonline/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ active_online: true }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        handleAddModalClose();
        await mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${id}?limit=10000000`,
        );
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleNonactive = async () => {
    setIsLoadingNonactive(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/activeonline/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ active_online: false }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        handleAddModalClose();
        await mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${id}?limit=10000000`,
        );
        window.location.reload();
      }
    } catch (e) {
    } finally {
      setIsLoadingNonactive(false);
    }
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="2xs"
          onClick={handleOpenAddModal}
          className="py-1 text-[10px] px-4 rounded-full bg-transparent text-secondary-700 border border-secondary-700 hover:bg-secondary-700 hover:text-neutral-50 cursor-pointer"
        >
          Online
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center w-96 justify-center border-0 rounded-[20px] overflow-auto gap-y-4">
        <div
          className="flex justify-end w-full cursor-pointer"
          onClick={handleAddModalClose}
        >
          <X className="text-neutral-800" />
        </div>
        <Image
          src="/icons/info.svg"
          alt="info"
          height={50}
          width={50}
          className="mb-5"
        />
        <h4 className="text-neutral-800 text-sm text-center w-[283px] mb-5">
          Pilih status aktif untuk semua layanan
        </h4>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-success-700 hover:bg-success-800 text-neutral-50 rounded-full px-[37px]"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Aktifkan"}
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={handleNonactive}
            className="bg-primary-700 hover:bg-primary-800 text-neutral-50 hover:text-neutral-50 rounded-full px-[37px]"
            disabled={isLoadingNonactive}
          >
            {isLoadingNonactive ? (
              <Loader className="animate-spin" />
            ) : (
              "Nonaktifkan"
            )}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
