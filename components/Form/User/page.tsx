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
import {
  bloodTypes,
  educations,
  genders,
  marriedStatus,
  religions,
} from "@/constants";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Swal from "sweetalert2";

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
  const [kecamatan, setKecamatan] = useState<any>(
    data && data.kecamatan_id ? data.kecamatan_id.toString() : "",
  );
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

  function formatDateToRegexPattern(isoDateString: any) {
    const dateObject = new Date(isoDateString);
    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObject.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        nik: data.nik,
        email: data.email,
        agama: data.agama,
        telepon: data.telepon,
        alamat: data.alamat,
        tempat_lahir: data.tempat_lahir,
        tgl_lahir: data.tgl_lahir,
        status_kawin: data.status_kawin,
        gender: data.gender,
        pekerjaan: data.pekerjaan,
        goldar: data.goldar,
        pendidikan: data.pendidikan,
        kecamatan_id: data.kecamatan_id.toString(),
        desa_id: data.desa_id.toString(),
        rt: data.rt,
        rw: data.rw,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof userValidation>) {
    setIsLoading(true);
    const formattedDate = formatDateToRegexPattern(values.tgl_lahir);
    const formData = {
      name: values.name,
      nik: values.nik,
      email: values.email,
      agama: Number(values.agama),
      telepon: values.telepon,
      alamat: values.alamat,
      tempat_lahir: values.tempat_lahir,
      tgl_lahir: formattedDate,
      status_kawin: Number(values.status_kawin),
      gender: Number(values.gender),
      pekerjaan: values.pekerjaan,
      goldar: Number(values.goldar),
      pendidikan: Number(values.pendidikan),
      kecamatan_id: kecamatan,
      desa_id: values.desa_id,
      rt: values.rt,
      rw: values.rw,
    };

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/userinfo/create`,
          {
            method: "POST",
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
          router.push("/manage-user");
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
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/userinfo/update/${data?.slug}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
          },
        );

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: `${result.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });
          router.push("/manage-user");
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
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      type="text"
                      placeholder="Masukkan Email"
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
                <FormItem className="space-y-5 flex flex-col">
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
              name="goldar"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Golongan Darah</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Goldar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypes.map((v) => (
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
          </div>
          <div className="space-y-3 w-full">
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Pendidikan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educations.map((v) => (
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
              name="pekerjaan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pekerjaan</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="Masukan pekerjaan."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kecamatan_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Select
                      value={kecamatan?.toString() || field.value?.toString()}
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
                        <SelectValue placeholder="Pilih Desa" />
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
