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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SurveyValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Label } from "@/components/ui/label";
import MyEditor from "@/components/Editor";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";

export default function AlertDialogUpdateSurvey({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<any>({
    field: "",
    status: "",
  });
  const editor1Ref = useRef<{ getContent: () => string }>(null);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/survey/formbyid/${id}`,
    fetcher,
  );

  const res = data?.data;

  useEffect(() => {
    if (res) {
      setForm({
        field: res?.field,
        status: res?.status === true ? "1" : "0",
      });
    }
  }, [res]);

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsLoading(true);
    const content1 = editor1Ref.current?.getContent();

    const formData = {
      field: form.field,
      status: form.status,
      desc: content1,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/surveyform/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formData),
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
      setIsLoading(false);
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
      <AlertDialogContent className="p-0 border-0 overflow-auto max-w-4xl h-full">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Ubah Pertanyaan
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Pertanyaan</Label>
            <Input
              placeholder="Masukkan pertanyaan"
              className="rounded-full"
              value={form.field}
              onChange={(e) => setForm({ ...form, field: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              defaultValue={form.status}
              onValueChange={(e) => setForm({ ...form, status: e })}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1">Aktif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="r2" />
                <Label htmlFor="r2">Tidak Aktif</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <MyEditor
              ref={editor1Ref}
              name="editor2"
              initialValue={res?.desc || "<p>Ketik disni</p>"}
            />
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
            onClick={onSubmit}
            className="bg-primary-700 hover:bg-primary-800 rounded-full"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Ubah"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
