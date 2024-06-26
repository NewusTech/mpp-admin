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
import { SigninValidation } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { useState } from "react";

const FormSignin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    setIsLoading(true);
    const formData = {
      nik: values.nik,
      password: values.password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (response.ok) {
        Cookies.set("token", data.data.token);
        await new Promise((resolve) => setTimeout(resolve, 300));
        toast(data.message);
        router.push("/");
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <Input
                  className="rounded-full"
                  type="text"
                  placeholder="Masukkan NIK"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="rounded-full"
                  type="password"
                  placeholder="Masukkan password"
                  {...field}
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
          {isLoading ? <Loader className="animate-spin" /> : "Masuk"}
        </Button>
      </form>
    </Form>
  );
};

export default FormSignin;
