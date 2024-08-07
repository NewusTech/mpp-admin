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
import { ContactValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MyEditor from "@/components/Editor";
import Swal from "sweetalert2";

export default function AlertDialogCreateContact(data: any) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editor1Ref = useRef<{ getContent: () => string }>(null);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof ContactValidation>>({
    resolver: zodResolver(ContactValidation),
  });

  const result = data?.data;

  useEffect(() => {
    if (result) {
      form.reset({
        email: result.email,
        alamat: result.alamat,
        telp: result.telp,
        latitude: result.latitude,
        longitude: result.longitude,
        website: result.website,
      });
    }
  }, [result]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ContactValidation>) {
    setIsLoading(true);
    const content1 = editor1Ref.current?.getContent();

    const formData = {
      email: values.email,
      alamat: values.alamat,
      telp: values.telp,
      latitude: values.latitude,
      longitude: values.longitude,
      website: values.website,
      desc: content1,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/contact/update`,
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

  console.log(data);

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
        >
          Kontak
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto max-w-[80%] h-[80%]">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Ubah Kontak
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        placeholder="Masukkan email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telp"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Telepon</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        placeholder="Masukkan telepon"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Garis Lintang</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        placeholder="Masukkan garis lintang"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Garis Bujur</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        placeholder="Masukkan garis bujur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full"
                        placeholder="Masukkan website"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-20"
                        placeholder="Masukkan alamat"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <label htmlFor="editor1" className="font-semibold">
                  Deskripsi
                </label>
                <MyEditor
                  ref={editor1Ref}
                  name="editor1"
                  initialValue={result?.desc || "<p>Ketik disini</p>"}
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
