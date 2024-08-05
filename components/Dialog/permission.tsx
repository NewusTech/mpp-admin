"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import InputComponent from "@/components/InputComponent";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

const ModalPermission = ({ id }: { id: number }) => {
  const router = useRouter();
  const [datapermis, setDatapermis] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/permission/get`,
    fetcher,
  );

  const handleCheckboxChange = (name: any) => {
    setDatapermis((prevState: any) =>
      prevState.includes(name)
        ? prevState.filter((item: any) => item !== name)
        : [...prevState, name],
    );
  };

  const result = data?.data;

  console.log(result);

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={handleOpenAddModal} className="group cursor-pointer">
          <p className="text-sm text-primary-700 opacity-70 group-hover:underline">
            Ubah Hak Akses
          </p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto">
        <AlertDialogHeader className="bg-primary-700 px-5 py-5">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Hak Akses Admin
          </AlertDialogTitle>
        </AlertDialogHeader>
        <p className="px-5 text-error-700">Role minimal 1</p>
        <div className="px-5">
          {result?.map((v: any) => (
            <div key={v.id} className="flex items-center mb-2 justify-between">
              <label htmlFor={v.id}>{v.name}</label>
              <input
                type="checkbox"
                id={v.id}
                name={v.name}
                value={v.name}
                checked={datapermis.includes(v.name)}
                onChange={() => handleCheckboxChange(v.name)}
              />
            </div>
          ))}
        </div>

        <div className="px-5">
          <hr />
        </div>
        <AlertDialogFooter className="px-5 pb-5 pt-3">
          <AlertDialogCancel
            type="button"
            onClick={handleAddModalClose}
            className="bg-neutral-700 hover:bg-neutral-800 text-neutral-50 hover:text-neutral-50 rounded-full px-[37px]"
          >
            Tutup
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary-700 hover:bg-primary-800 text-neutral-50 rounded-full px-[37px]"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Simpan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalPermission;
