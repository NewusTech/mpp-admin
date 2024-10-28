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
import { AdminValidation, AdminValidationUpdate } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader, Search } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roles } from "@/constants";
import Swal from "sweetalert2";

const AdminData = ({ role }: { role: string | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const [searchTermService, setSearchTermService] = useState("");
  const [searchInputService, setSearchInputService] = useState(""); // State for search input
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");

  const { data: instances } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher
  );

  const instanceId = Number(instance);

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${instanceId}?search=${searchTermService}`;

  const { data: services } = useSWR(url, fetcher);

  const serviceId = Number(service);

  const resultInstance = instances?.data;
  const resultService = services?.data;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
      setSearchTermService(searchInputService);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance, searchInputService]);

  const form = useForm<z.infer<typeof AdminValidation>>({
    resolver: zodResolver(AdminValidation),
  });

  const availableRoles =
    role === "Admin Instansi" // Misalkan ID 2 adalah Super Admin
      ? roles.filter((role) => [3, 4, 6].includes(role.id)) // Tampilkan hanya role 3, 4, 6
      : roles;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AdminValidation>) {
    setIsLoading(true);
    const formData = {
      name: values.name,
      nik: values.nik,
      instansi_id: instanceId,
      role_id: Number(values.role_id),
      layanan_id: Number(values.layanan_id),
      password: values.password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formData),
        }
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      type="password"
                      placeholder="Masukkan Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instansi_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Instansi</FormLabel>
                  <FormControl>
                    <Select
                      value={instance}
                      onValueChange={(e) => setInstance(e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Instansi" />
                      </SelectTrigger>
                      <SelectContent className="pt-10">
                        <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10">
                          <Search className="text-slate-400" />
                          <Input
                            placeholder="Search..."
                            className="w-full border-0"
                            value={searchInputInstance}
                            onChange={(e) =>
                              setSearchInputInstance(e.target.value)
                            }
                          />
                        </div>
                        <SelectGroup>
                          <SelectLabel>Instansi</SelectLabel>
                          {resultInstance?.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="layanan_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Layanan</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Layanan" />
                      </SelectTrigger>
                      <SelectContent className="pt-10">
                        <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10">
                          <Search className="text-slate-400" />
                          <Input
                            placeholder="Search..."
                            className="w-full border-0"
                            value={searchInputService}
                            onChange={(e) =>
                              setSearchInputService(e.target.value)
                            }
                          />
                        </div>
                        <SelectGroup>
                          <SelectLabel>Layanan</SelectLabel>
                          {resultService?.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          {availableRoles?.map((item: any) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.key}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
          {isLoading ? <Loader className="animate-spin" /> : "Tambah"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminData;
