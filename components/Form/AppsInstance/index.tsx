"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { AppsInstanceValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";

interface ArticleBySlug {
  name: string;
  desc: string;
  file: string;
  slug: string;
  link: string;
  id: number;
}

const AppsInstances = ({
  data,
  type,
  label,
  id,
}: {
  label: string;
  type?: string;
  data?: ArticleBySlug;
  id?: number;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof AppsInstanceValidation>>({
    resolver: zodResolver(AppsInstanceValidation),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        description: data.desc,
        link: data.link,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppsInstanceValidation>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("desc", values.description);
    formData.append("link", values.link);
    if (values.file && values.file.length > 0) {
      formData.append("file", values.file[0]);
    }

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/apkinstansi/create/${id}`,
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
          Swal.fire({
            icon: "success",
            title: `${data.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });

          router.push("/master/master-apps-instance");
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
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/apkinstansi/update/${data?.id}`,
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
          Swal.fire({
            icon: "success",
            title: `${result.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });

          router.push("/master/master-apps-instance");
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  className="rounded-full"
                  type="text"
                  placeholder="Masukkan Nama"
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
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  className="rounded-full"
                  type="text"
                  placeholder="Masukkan link"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo Apps</FormLabel>
              <FormControl>
                <FileUploader
                  mediaUrl={data?.file}
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
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : label}
        </Button>
      </form>
    </Form>
  );
};

export default AppsInstances;
