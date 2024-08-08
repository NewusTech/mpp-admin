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
import { AdminValidationUpdate } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader, Search } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UpdateAdmin = ({ slug, data }: { slug: string; data: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AdminValidationUpdate>>({
    resolver: zodResolver(AdminValidationUpdate),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        nik: data.nik,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AdminValidationUpdate>) {
    setIsLoading(true);
    const formData = {
      name: values.name,
      nik: values.nik,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/userinfo/update/${slug}`,
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
        router.push("/manage-user/admin");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-x-4 justify-between">
          <div className="space-y-3 w-full">
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      type="text"
                      placeholder="Masukkan Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
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
          </div>
        </div>
        <Button
          className="w-full rounded-full bg-primary-700 hover:bg-primary-800 text-neutral-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : "Ubah"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateAdmin;
