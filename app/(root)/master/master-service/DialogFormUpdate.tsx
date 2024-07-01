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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ServiceValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import FileUploader from "@/components/FileUploader";
import MyEditor from "@/components/Editor";

export default function AlertDialogUpdateService({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const editor = useRef<{ getContent: () => string }>(null);
  const [namaLayanan, setNamaLayanan] = useState("");
  const [status, setStatus] = useState("1");
  const content1 = editor.current?.getContent();

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data: service } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/get/${id}`,
    fetcher,
  );

  const serviceOne = service?.data;

  useEffect(() => {
    if (serviceOne) {
      setNamaLayanan(serviceOne.name);
      setStatus(serviceOne.status ? "1" : "0");
    }
  }, [serviceOne]);

  // 2. Define a submit handler.
  async function onSubmit() {
    const formData = {
      name: namaLayanan,
      instansi_id: id,
      desc: content1,
      status: Number(status),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
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
        <div
          onClick={handleOpenAddModal}
          className="px-2 py-1 cursor-pointer hover:bg-slate-100 rounded"
        >
          <p className="text-sm">Edit</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto h-full max-w-[50%]">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Ubah Layanan
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Nama Layanan</Label>
            <Input
              className="rounded-full"
              type="text"
              placeholder="Masukkan Layanan"
              value={namaLayanan}
              onChange={(e) => setNamaLayanan(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Informasi Layanan</Label>
            <MyEditor
              ref={editor}
              name="editor"
              initialValue={serviceOne?.desc || "Deskripsi"}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              className="flex space-x-2"
              value={status}
              onValueChange={(value) => setStatus(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="aktif" />
                <Label htmlFor="aktif">Aktif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="tidak" />
                <Label htmlFor="tidak">Tidak Aktif</Label>
              </div>
            </RadioGroup>
          </div>
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
            Ubah
          </AlertDialogAction>
        </AlertDialogFooter>
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
