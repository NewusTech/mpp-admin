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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ServiceFileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/FileUploader";
import Swal from "sweetalert2";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

export default function AlertDialogCreateLayananFile({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof ServiceFileValidation>>({
    resolver: zodResolver(ServiceFileValidation),
  });

  const fileRef = form.register("file");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ServiceFileValidation>) {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("file", values.file[0]);
    formData.append("name", values.name);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layananfile/create/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
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
  }

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
        >
          Tambah
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Layanan File
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="rounded-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Dokumen</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="rounded-full"
                        {...fileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  {isLoading ? <Loader className="animate-spin" /> : "Tambah"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
