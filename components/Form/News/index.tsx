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
import { useEffect, useRef, useState } from "react";
import useNewsStore from "@/lib/store/useNewsStore";
import MyEditor from "@/components/Editor";
import { Label } from "@/components/ui/label";

interface ArticleBySlug {
  title: string;
  desc: string;
  image: string;
  slug: string;
}

const News = ({ data, type }: { type?: string; data?: ArticleBySlug }) => {
  const router = useRouter();
  const selectedId = useNewsStore((state) => state.selectedId);
  const editor1Ref = useRef<{ getContent: () => string }>(null);
  const [image, setImage] = useState<File | null>(null);
  const titleRef = useRef<HTMLInputElement>(null); // Ref untuk title input
  const handleFileChange = (files: File[]) => {
    setImage(files[0]);
  };

  // 2. Define a submit handler.
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content1: any = editor1Ref.current?.getContent();
    const title: any = titleRef.current?.value;

    const formData = new FormData();
    formData.append("instansi_id", selectedId.toString());
    formData.append("title", title);
    formData.append("desc", content1);
    if (image) {
      formData.append("image", image);
    }

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
        console.log(data);
        if (response.ok) {
          toast(data.message);
          router.push("/articles");
        }
      } catch (error: any) {
        toast(error.message);
        console.log(error.message);
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

  console.log(data);

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            type="text"
            name="title"
            className="rounded-full"
            defaultValue={data?.title}
            ref={titleRef}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editor1">Deskripsi</Label>
          <MyEditor
            ref={editor1Ref}
            name="editor1"
            initialValue={data?.desc || "<p>Ketik disini</p>"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Gambar</Label>
          <FileUploader mediaUrl={data?.image} fileChange={handleFileChange} />
        </div>
        <Button
          type="submit"
          className="w-full rounded-full bg-primary-700 hover:bg-primary-800 text-neutral-50"
        >
          Tambah
        </Button>
      </form>
    </div>
  );
};

export default News;
