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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import MyEditor from "@/components/Editor";

export default function AlertDialogCreateTermAndCondition() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/termcond/get`,
    fetcher,
  );

  const result = data?.data;

  const editor1Ref = useRef<{ getContent: () => string }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const content1 = editor1Ref.current?.getContent();

    const payload = {
      desc: content1,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/termcond/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      if (response.ok) {
        toast(result.message);
        handleAddModalClose();
      }
    } catch (error: any) {
      toast(error.message);
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
          Syarat & Ketentuan
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto max-w-[60%]">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Syarat & Ketentuan
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <label htmlFor="editor1">Syarat & Ketentuan</label>
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
              disabled={isLoading ? true : false}
            >
              {isLoading ? <Loader className="animate-spin" /> : "Simpan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// useEffect(() => {
//   if (data) {
//     form.reset({
//       question: data.question,
//       answer: data.answer,
//     });
//   }
// }, [data]);
