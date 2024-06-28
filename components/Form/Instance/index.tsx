"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InstanceValidation } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/FileUploader";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Instance = ({
  data,
  type,
  label,
}: {
  type?: string;
  data?: any;
  label: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof InstanceValidation>>({
    resolver: zodResolver(InstanceValidation),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        desc: data.desc,
        status: data?.status === true ? "1" : "0",
        address: data.alamat,
        phone: data.telp,
        pj: data.pj,
        nip_pj: data.nip_pj,
        active_offline: data?.active_offline === true ? "1" : "0",
        active_online: data?.active_online === true ? "1" : "0",
        open: data.jam_buka,
        closed: data.jam_tutup,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof InstanceValidation>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("desc", values.desc);
    formData.append("status", values.status);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    formData.append("alamat", values.address);
    formData.append("telp", values.phone);
    formData.append("pj", values.pj);
    formData.append("nip_pj", values.nip_pj);
    formData.append("active_offline", values.active_offline);
    formData.append("active_online", values.active_online);
    formData.append("jam_buka", values.open);
    formData.append("jam_tutup", values.closed);

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/create`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: formData,
          },
        );

        const data = await response.json();
        if (response.ok) {
          toast(data.message);
          router.push("/master/master-instance");
        }
      } catch (error: any) {
        toast(error.message);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/update/${data?.slug}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: formData,
          },
        );

        const result = await response.json();

        if (response.ok) {
          toast(result.message);
          router.push("/master/master-instance");
        }
      } catch (error: any) {
        toast(error.message);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-x-4 justify-between">
          <div className="space-y-3 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
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
                <FormItem className="space-y-3">
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
                      className="h-40"
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
                      value={field.value}
                      className="flex space-x-1"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Aktif</FormLabel>
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
                <FormItem className="space-y-3">
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <FileUploader
                      mediaUrl={data?.image}
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
                <FormItem className="space-y-3">
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
                      className="h-40"
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
                      value={field.value}
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
                        <FormLabel className="font-normal">Tidak</FormLabel>
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
                      value={field.value}
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
                        <FormLabel className="font-normal">Tidak</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          className="w-full rounded-full bg-primary-700 hover:bg-primary-800 text-neutral-50"
          type="submit"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <Loader className="animate-spin" /> : `${label}`}
        </Button>
      </form>
    </Form>
  );
};

export default Instance;
