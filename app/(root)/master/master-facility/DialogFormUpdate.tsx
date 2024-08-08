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
import { FacilitiesValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import FileUploader from "@/components/FileUploader";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";

export default function AlertDialogUpdateFacility({ slug }: { slug: string }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof FacilitiesValidation>>({
    resolver: zodResolver(FacilitiesValidation),
  });

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/facilities/get/${slug}`,
    fetcher,
  );

  const result = data?.data;

  useEffect(() => {
    if (result) {
      form.reset({
        image: result.image,
        title: result.title,
      });
    }
  }, [result]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof FacilitiesValidation>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", values.image[0]);
    formData.append("title", values.title);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/facilities/update/${slug}`,
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
      <AlertDialogContent className="p-0 border-0 overflow-auto h-full">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Ubah Fasilitas
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan judul"
                        className="rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      <FileUploader
                        mediaUrl={result?.image}
                        fileChange={field.onChange}
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
                  disabled={isLoading ? true : false}
                >
                  {isLoading ? <Loader className="animate-spin" /> : "Ubah"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
