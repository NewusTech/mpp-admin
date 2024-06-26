"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useState } from "react";

export default function AlertDialogUploadFile({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  // 2. Define a submit handler.
  async function onSubmit() {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/file/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        setSelectedFile(null);
        handleAddModalClose();
      }
    } catch (error: any) {
      toast(error.message);
      console.log(error);
    }
  }

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="rounded-[20px] bg-neutral-50 px-10 hover:bg-neutral-100 shadow p-3 flex text-sm justify-around items-center text-neutral-900"
        >
          Upload Dokumen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto w-full">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Upload Dokumen
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Input
            type="file"
            className="rounded-full"
            onChange={handleFileChange}
          />
        </div>
        <AlertDialogFooter className="p-6">
          <AlertDialogCancel
            onClick={handleAddModalClose}
            className="bg-transparent border border-primary-700 rounded-full hover:bg-primary-700 hover:text-neutral-50 text-primary-700"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={onSubmit}
            className="bg-primary-700 hover:bg-primary-800 rounded-full"
          >
            Tambah
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
