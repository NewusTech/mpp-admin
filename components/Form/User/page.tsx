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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { userValidation } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/FileUploader";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { genders, marriedStatus, religions } from "@/constants";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

const UserData = ({
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
  const [kecamatan, setKecamatan] = useState<any>(null);
  const [searchKecamatanTerm, setSearchKecamatanTerm] = useState("");
  const [searchKecamatanInput, setSearchKecamatanInput] = useState("");
  const [searchVillageTerm, setSearchVillageTerm] = useState("");
  const [searchVillageInput, setSearchVillageInput] = useState("");

  const { data: kecamatans } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/kecamatan/get?search=${searchKecamatanTerm}`,
    fetcher,
  );

  const { data: desa } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/desa/get?kecamatan_id=${kecamatan}&search=${searchVillageTerm}`,
    fetcher,
  );

  const resultKec = kecamatans?.data;
  const resultDesa = desa?.data;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKecamatanTerm(searchKecamatanInput);
      setSearchVillageTerm(searchVillageInput);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchKecamatanInput, searchVillageInput]);

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
  });

  // useEffect(() => {
  //   if (data) {
  //     form.reset({
  //       name: data.name,
  //       desc: data.desc,
  //       status: data?.status === true ? "1" : "0",
  //       address: data.alamat,
  //       phone: data.telp,
  //       pj: data.pj,
  //       nip_pj: data.nip_pj,
  //       active_offline: data?.active_offline === true ? "1" : "0",
  //       active_online: data?.active_online === true ? "1" : "0",
  //       open: data.jam_buka,
  //       closed: data.jam_tutup,
  //     });
  //   }
  // }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof userValidation>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("nik", values.nik);
    formData.append("email", values.email);
    formData.append("telepon", values.telepon);
    formData.append("alamat", values.alamat);
    formData.append("agama", values.agama);
    formData.append("tempat_lahir", values.tempat_lahir);
    formData.append("tgl_lahir", values.tgl_lahir);
    formData.append("status_kawin", values.status_kawin);
    formData.append("gender", values.gender);
    formData.append("pekerjaan", values.pekerjaan);
    formData.append("goldar", values.goldar);
    formData.append("kecamatan_id", values.kecamatan);
    formData.append("desa_id", values.desa_id);
    formData.append("rt", values.rt);
    formData.append("rw", values.rw);
    formData.append("pekerjaan", values.pekerjaan);
    if (values.filektp && values.filektp.length > 0) {
      formData.append("image", values.filektp[0]);
    }
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
              name="nik"
              render={({ field }) => (
                <FormItem className="space-y-3">
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
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Nama Pengguna</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      type="text"
                      placeholder="Masukkan Nama Pengguna"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telepon"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="Masukan no telepon."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agama"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Agama</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Agama" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {religions.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempat_lahir"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="Masukan tempat lahir."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tgl_lahir"
              render={({ field }) => (
                <FormItem className="space-y-3 flex flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status_kawin"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status Kawin</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status Kawin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marriedStatus.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pendidikan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pendidikan</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="Masukan pendidikan."
                      {...field}
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
              name="kecamatan_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Select
                      value={kecamatan?.toString()}
                      onValueChange={(e) => setKecamatan(e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kecamatan" />
                      </SelectTrigger>
                      <SelectContent className="pt-10">
                        <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10">
                          <Search className="text-slate-400" />
                          <Input
                            placeholder="Search..."
                            className="w-full border-0"
                            value={searchKecamatanInput}
                            onChange={(e) =>
                              setSearchKecamatanInput(e.target.value)
                            }
                          />
                        </div>
                        <SelectGroup>
                          <SelectLabel>Kecamatan</SelectLabel>
                          {resultKec?.map((item: any) => (
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
              name="desa_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Desa</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kecamatan" />
                      </SelectTrigger>
                      <SelectContent className="pt-10">
                        <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10">
                          <Search className="text-slate-400" />
                          <Input
                            placeholder="Search..."
                            className="w-full border-0"
                            value={searchVillageInput}
                            onChange={(e) =>
                              setSearchVillageInput(e.target.value)
                            }
                          />
                        </div>
                        <SelectGroup>
                          <SelectLabel>Desa</SelectLabel>
                          {resultDesa?.map((item: any) => (
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
              name="rt"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>RT</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="Masukkan RT"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rw"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>RW</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="Masukkan RW"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat"
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

export default UserData;
