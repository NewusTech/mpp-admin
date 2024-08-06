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
import { useEffect, useState } from "react";
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

  const { data: permission } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/permissions/${id}`,
    fetcher,
  );

  const handleCheckboxChange = (id: number) => {
    setDatapermis((prevState: any) =>
      prevState.includes(id)
        ? prevState.filter((item: any) => item !== id)
        : [...prevState, id],
    );
  };

  const result = data?.data;
  const permissionResult = permission?.data;

  useEffect(() => {
    const ids = permissionResult?.permissions.map(
      (permission: any) => permission.id,
    );
    setDatapermis(ids);
  }, [permissionResult]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = {
      userId: id, // Assuming `id` is an integer
      permissions: datapermis, // Array of integers
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/permissions`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        toast(result.message);
        handleAddModalClose();
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <label htmlFor={v.name} className="cursor-pointer">
                {v.name}
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  id={v.id}
                  name={v.name}
                  value={v.id}
                  checked={datapermis?.includes(v.id)}
                  onChange={() => handleCheckboxChange(v.id)}
                />
                <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                  <svg
                    className={`w-4 h-4 text-white ${datapermis?.includes(v.id) ? "block" : "hidden"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
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
            onClick={handleSubmit}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Simpan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalPermission;
