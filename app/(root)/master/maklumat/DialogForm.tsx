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
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import MyEditor from "@/components/Editor";
import Swal from "sweetalert2";

export default function AlertDialogCreateMaklumat() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/maklumat/get`,
    fetcher,
  );

  const result = data?.data?.maklumat;

  const editor1Ref = useRef<{ getContent: () => string }>(null);

  const content1 = editor1Ref.current?.getContent();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/maklumat/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ desc: content1 }),
        },
      );

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${result.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        handleAddModalClose();
        window.location.reload();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-primary-700 hover:bg-primary-800 w-[170px] rounded-full"
        >
          Maklumat
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto max-w-[60%]">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Maklumat
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <label htmlFor="editor1">Maklumat</label>
            <MyEditor
              ref={editor1Ref}
              name="editor1"
              initialValue={result?.desc || "<p>Ketik disni</p>"}
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
              className="bg-primary-700 hover:bg-primary-800 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin" /> : "Simpan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
