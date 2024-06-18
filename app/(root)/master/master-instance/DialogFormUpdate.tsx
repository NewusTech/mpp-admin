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
import { InstanceValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import FileUploader from "@/components/FileUploader";

export default function AlertDialogUpdateInstance({ slug }: { slug: string }) {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: service } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get/${slug}`,
    fetcher
  );

  const result = service?.data;

  useEffect(() => {
    if (result) {
      form.reset({
        name: result.name,
        desc: result.desc,
        status: result.status,
        address: result.alamat,
        phone: result.telp,
        pj: result.pj,
        nip_pj: result.nip_pj,
        active_offline: result.active_offline,
        active_online: result.active_online,
        open: result.jam_buka,
        closed: result.jam_tutup,
      });
    }
  }, [result]);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof InstanceValidation>>({
    resolver: zodResolver(InstanceValidation),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof InstanceValidation>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("desc", values.desc);
    formData.append("status", values.status);
    formData.append("alamat", values.address);
    formData.append("telp", values.phone);
    formData.append("pj", values.pj);
    formData.append("nip_pj", values.nip_pj);
    formData.append("active_offline", values.active_offline);
    formData.append("active_online", values.active_online);
    formData.append("jam_buka", values.open);
    formData.append("jam_tutup", values.closed);
    formData.append("image", values.image[0]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/update/${slug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      toast(data.message);
      if (response.ok) {
        form.reset();
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
      <AlertDialogContent className="p-0 border-0 overflow-auto w-full">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Tambah Layanan
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4 justify-between">
                <div className="space-y-3 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Instansi</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-full"
                            type="text"
                            placeholder="Masukkan Judul"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Telefon</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-full"
                            type="text"
                            placeholder="Masukkan No Telefon"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pj"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Penanggung Jawab</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-full"
                            placeholder="Masukan penanggung jawab."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-20"
                            placeholder="Masukkan deskripsi."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-1"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Aktif
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="0" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tidak Aktif
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <FileUploader
                            type="logo"
                            mediaUrl={result.image}
                            fileChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3 w-full">
                  <FormField
                    control={form.control}
                    name="nip_pj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIP PJ</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-full"
                            type="text"
                            placeholder="Masukkan np pj"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="open"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Jam Buka</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-full"
                            placeholder="Masukkan Jam Buka"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="closed"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Jam Tutup</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-full"
                            placeholder="Masukkan Jam Tutup"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-20"
                            placeholder="Masukkan alamat."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="active_online"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Aktif Online</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-1"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1" />
                              </FormControl>
                              <FormLabel className="font-normal">Ya</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="0" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tidak
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="active_offline"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Aktif Offline</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-1"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1" />
                              </FormControl>
                              <FormLabel className="font-normal">Ya</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="0" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tidak
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-800 rounded-full"
                >
                  Tambah
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
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
