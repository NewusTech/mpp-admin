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
import { AppsValidation } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/FileUploader";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

interface ArticleBySlug {
  name: string;
  desc: string;
  image: string;
  slug: string;
  link: string;
}

const AppsInstance = ({
  data,
  type,
  label,
}: {
  label: string;
  type?: string;
  data?: ArticleBySlug;
}) => {
  const router = useRouter();
  const editor1Ref = useRef<{ getContent: () => string }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof AppsValidation>>({
    resolver: zodResolver(AppsValidation),
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
  async function onSubmit(values: z.infer<typeof AppsValidation>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("desc", values.description);
    formData.append("link", values.link);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/aplikasietc/create`,
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
          router.push("/master/master-apps");
        }
      } catch (error: any) {
        toast(error.message);
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/aplikasietc/update/${data?.slug}`,
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
          router.push("/master/master-apps");
        }
      } catch (error: any) {
        toast(error.message);
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
          disabled={isLoading ? true : false}
        >
          {isLoading ? <Loader className="animate-spin" /> : label}
        </Button>
      </form>
    </Form>
  );
};

export default AppsInstance;
