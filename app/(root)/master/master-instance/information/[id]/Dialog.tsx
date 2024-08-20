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
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import MyEditor from "@/components/Editor";
import Swal from "sweetalert2";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { InformationInstance } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploader from "@/components/FileUploader";
import { Input } from "@/components/ui/input";

export default function AlertDialogCreateInformation({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof InformationInstance>>({
    resolver: zodResolver(InformationInstance),
  });

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/infoinstansi/get/${id}`,
    fetcher,
  );

  const editor1Ref = useRef<{ getContent: () => string }>(null);

  const result = data?.data?.Infoinstansi;

  useEffect(() => {
    if (result) {
      form.reset({
        title: result?.title,
      });
    }
  }, [result]);

  async function onSubmit(values: z.infer<typeof InformationInstance>) {
    setIsLoading(true);

    const content1 = editor1Ref.current?.getContent();

    const formData = new FormData();
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    if (content1) {
      formData.append("content", content1);
    }
    formData.append("title", values.title);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/infoinstansi/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
        },
      );

      const result = await response.json();
      console.log(result);
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
  }

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-primary-700 hover:bg-primary-800 w-[170px] rounded-full"
        >
          Information
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto max-w-[60%] h-full">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Information
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-9"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input type="text" className="rounded-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label htmlFor="editor1">Konten</label>
              <MyEditor
                ref={editor1Ref}
                name="editor1"
                initialValue={result?.content || "<p>Ketik disni</p>"}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <FileUploader
                      fileChange={field.onChange}
                      mediaUrl={result?.image}
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
                {isLoading ? <Loader className="animate-spin" /> : "Simpan"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
