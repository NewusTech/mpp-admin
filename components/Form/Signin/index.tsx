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
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useState } from "react";
import useAuthStore from "@/lib/store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";

const FormSignin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk toggle visibilitas kata sandi
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const login = useAuthStore((state) => state.login);

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
        `${process.env.NEXT_PUBLIC_API_URL}/user/login?admin=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        // Tangani respons yang bukan 2xx
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      if (response.ok) {
        const tokenAuth = data.data.token;
        login(tokenAuth);
        await new Promise((resolve) => setTimeout(resolve, 300));
        Swal.fire({
          icon: "success",
          title: "Login berhasil!",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        // Redirect ke path tujuan setelah login
        const pathBeforeLogin =
          sessionStorage.getItem("pathBeforeLogin") || "/";
        sessionStorage.removeItem("pathBeforeLogin");
        router.push(pathBeforeLogin);
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: "Username atau password salah",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="rounded-full"
                  type="text"
                  placeholder="Masukkan username"
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
                <div className="flex rounded-full border items-center pr-4">
                  <Input
                    className="rounded-full border-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    {...field}
                  />
                  <div
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="text-greyy" />
                    ) : (
                      <Eye className="text-greyy" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            className="w-1/2 rounded-full bg-primary-700 hover:bg-primary-800 text-neutral-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Masuk"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormSignin;
