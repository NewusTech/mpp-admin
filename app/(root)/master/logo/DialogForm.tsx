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
import { LogoMPPValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploader from "@/components/FileUploader";

export default function AlertDialogCreateLogo() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof LogoMPPValidation>>({
    resolver: zodResolver(LogoMPPValidation),
  });

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/logo/get`,
    fetcher,
  );

  const result = data?.data;

  async function onSubmit(values: z.infer<typeof LogoMPPValidation>) {
    setIsLoading(true);

    const formData = new FormData();
    if (values.logo_mpp && values.logo_mpp.length > 0) {
      formData.append("logo_mpp", values.logo_mpp[0]);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/logo/update`,
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
          Logo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto max-w-[60%]">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Logo
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-9"
          >
            <FormField
              control={form.control}
              name="logo_mpp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo MPP</FormLabel>
                  <FormControl>
                    <FileUploader
                      fileChange={field.onChange}
                      mediaUrl={result?.logo_mpp}
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
