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
import { NewsValidation } from "@/lib/validation";
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

const News = ({ data, type }: { type?: string; data?: ArticleBySlug }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof NewsValidation>>({
    resolver: zodResolver(NewsValidation),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        description: data.desc,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof NewsValidation>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("desc", values.description);
    formData.append("image", values.image[0]);

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/artikel/create`,
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
        if (response.ok) router.push("/articles");
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
        if (response.ok) router.push("/articles");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
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

export default News;
