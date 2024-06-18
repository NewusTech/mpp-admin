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
import { useEffect } from "react";

interface ArticleBySlug {
  title: string;
  desc: string;
  image: string;
  slug: string;
}

const Instance = ({ data, type }: { type?: string; data?: ArticleBySlug }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof InstanceValidation>>({
    resolver: zodResolver(InstanceValidation),
    defaultValues: {
      name: "",
      description: "",
      status: "",
      address: "",
      phone: "",
      pj: "",
      nip_pj: "",
      active_offline: "",
      active_online: "",
      open: "",
      closed: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        desc: data.desc,
        status: data.status,
        alamat: data.address,
        telp: data.telp,
        pj: data.pj,
        nip_pj: data.nip_pj,
        active_offline: data.active_offline,
        active_online: data.active_online,
        jam_buka: data.open,
        jam_tutup: data.closed,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof InstanceValidation>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("desc", values.description);
    formData.append("status", values.status);
    formData.append("image", values.image[0]);
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
        toast(data.message);
        if (response.ok) router.push("/master/master-instance");
      } catch (error: any) {
        toast(error.message);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/artikel/update/${data?.slug}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: formData,
          },
        );

        const result = await response.json();
        toast(result.message);
        if (response.ok) router.push("/master/master-instance");
      } catch (error: any) {
        toast(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Dinas</FormLabel>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  className="h-40"
                  placeholder="Type your message here."
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
            <FormItem>
              <FormLabel>Gambar</FormLabel>
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
        <Button
          className="w-full rounded-full bg-primary-700 hover:bg-primary-800 text-neutral-50"
          type="submit"
        >
          Masuk
        </Button>
      </form>
    </Form>
  );
};

export default Instance;
