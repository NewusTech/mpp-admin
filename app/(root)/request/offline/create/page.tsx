"use client";

import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import useCreateRequestOffline from "@/lib/store/useCreateRequestOffline";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import React, { useState, ChangeEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import ProtectedRoute from "@/components/ProtectedRoute";
import Swal from "sweetalert2";

// Define types
type FormValue = string | number | boolean | Record<string, boolean>;
interface FormData {
  id: string;
  field: string;
  tipedata: string;
  isrequired: boolean;
  datajson?: { id: string; key: string }[];
}

interface DocData {
  id: string;
  field: string;
  isrequired: boolean;
}

const CreateOffline = () => {
  const router = useRouter();
  const serviceId = useCreateRequestOffline((state) => state.serviceId);
  const [formValues, setFormValues] = useState<Record<string, FormValue>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [docValues, setDocValues] = useState<Record<string, File | null>>({});
  const [userData, setUserData] = useState<any>(null); // State for storing selected user data
  const [searchTerm, setSearchTerm] = useState("");
  const [kecamatan, setKecamatan] = useState<any>(null);
  const [searchKecamatanTerm, setSearchKecamatanTerm] = useState("");
  const [searchKecamatanInput, setSearchKecamatanInput] = useState("");
  const [village, setVillage] = useState<any>(null);
  const [searchVillageTerm, setSearchVillageTerm] = useState("");
  const [searchVillageInput, setSearchVillageInput] = useState("");
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [selectedUser, setSelectedUser] = useState(""); // State untuk menyimpan nilai yang dipilih
  const [form, setForm] = useState({
    name: "",
    nik: "",
    telepon: "",
    email: "",
    kec: "",
    desa: "",
    rt: "",
    rw: "",
    alamat: "",
  });

  const handleChange = (id: string, value: FormValue) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleDocChange = (id: string, file: File | null) => {
    setDocValues((prevValues) => ({
      ...prevValues,
      [id]: file,
    }));
  };

  const handleChangeUserData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { data: kecamatans } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/kecamatan/get?search=${searchKecamatanTerm}`,
    fetcher,
  );

  const { data: desa } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/desa/get?kecamatan_id=${userData ? userData.kecamatan_id : kecamatan}&search=${searchVillageTerm}`,
    fetcher,
  );

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/form/${serviceId}`,
    fetcher,
  );

  const { data: inputFile } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/docs/${serviceId}`,
    fetcher,
  );

  const { data: users } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alluserinfo/get?search=${searchTerm}&role=5`,
    fetcher,
  );

  const resultUser = users?.data;
  const resultKec = kecamatans?.data;
  const resultDesa = desa?.data;
  const resultForm: FormData[] = data?.data?.Layananforms || [];
  const resultDocs: DocData[] = inputFile?.data?.Layananforms || [];

  console.log(resultForm);
  console.log(resultDocs);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    if (selectedUser) {
      const user = resultUser?.find(
        (item: any) => item.id.toString() === selectedUser,
      );
      setUserData(user);
    }
  }, [selectedUser, resultUser]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("userId", selectedUser);
    // Menambahkan datainput dari formValues
    Object.entries(formValues).forEach(([key, value], index) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Mengonversi objek menjadi array
        const selectedValues = Object.keys(value).filter((k) => value[k]);
        formData.append(`datainput[${index}][layananform_id]`, key);
        formData.append(
          `datainput[${index}][data]`,
          JSON.stringify(selectedValues),
        );
      } else {
        // Jika value adalah data primitif
        formData.append(`datainput[${index}][layananform_id]`, key);
        formData.append(`datainput[${index}][data]`, value.toString());
      }
    });

    // Menambahkan datafile dari docValues
    Object.entries(docValues).forEach(([key, value], index) => {
      if (value) {
        formData.append(`datafile[${index}][layananform_id]`, key);
        formData.append(`datafile[${index}][data]`, value); // Menambahkan file ke FormData
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/create/${serviceId}`,
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
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        router.push("/manage-approvals?tabs=offline");
      }
    } catch (error) {
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
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKecamatanTerm(searchKecamatanInput);
      setSearchVillageTerm(searchVillageInput);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchKecamatanInput, searchVillageInput]);

  const handleCreateUser = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("nik", form.nik);
    if (form.telepon) {
      formData.append("telepon", form.telepon);
    }
    if (form.email) {
      formData.append("email", form.email);
    }
    if (kecamatan) {
      formData.append("kecamatan_id", kecamatan.toString());
    }
    if (village) {
      formData.append("desa_id", village.toString());
    }
    if (form.rt) {
      formData.append("rt", form.rt);
    }
    if (form.rw) {
      formData.append("rw", form.rw);
    }
    if (form.alamat) {
      formData.append("alamat", form.alamat);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/userinfo/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }

      console.log(JSON.stringify(formData));

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        setSelectedUser(data.data.id);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setUserData(null);
    setSelectedUser("");
    setForm({
      name: "",
      nik: "",
      telepon: "",
      email: "",
      kec: "",
      desa: "",
      rt: "",
      rw: "",
      alamat: "",
    });
    setKecamatan(null);
    setVillage(null);
  };

  return (
    <ProtectedRoute
      roles={[
        "Super Admin",
        "Admin Instansi",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/request/offline">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="flex space-x-5 items-center">
          <h1 className="text-lg font-semibold">Cari NIK</h1>
          <div className="w-1/2">
            <Select
              value={selectedUser}
              onValueChange={(e: string) => setSelectedUser(e)}
            >
              <SelectTrigger name="nik" className="w-full rounded-full ">
                <SelectValue placeholder="Pilih NIK" />
              </SelectTrigger>
              <SelectContent className="pt-10">
                <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10">
                  <Search className="text-slate-400" />
                  <Input
                    placeholder="Search..."
                    className="w-full border-0"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                </div>
                {resultUser?.map((item: any) => (
                  <SelectItem
                    key={item.id}
                    className="w-full"
                    value={item.id.toString()}
                  >
                    <div className="py-1 w-full">
                      <h2 className="font-bold">{item.nik}</h2>
                      <p className="text-sm">{item.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div onClick={clearForm} className="cursor-pointer">
            <X className="text-error-700 font-bold" />
          </div>
        </div>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-8 p-8">
          {userData ? (
            <div className="flex justify-between gap-x-10">
              <div className="w-1/2 space-y-4">
                <h1 className="text-xl font-semibold mb-4">Data Diri</h1>
                <div className="space-y-2">
                  <p>Nama</p>
                  <InputComponent value={userData.name} />
                </div>
                <div className="space-y-2">
                  <p>NIK</p>
                  <InputComponent value={userData.nik} />
                </div>
                <div className="space-y-2">
                  <p>Nomor Telepon</p>
                  <InputComponent value={userData.telepon} />
                </div>
                <div className="space-y-2">
                  <p>Email</p>
                  <InputComponent value={userData.email} />
                </div>
              </div>
              <div className="w-1/2 space-y-4">
                <h1 className="text-xl font-semibold mb-4">Alamat</h1>
                <div className="flex gap-x-4">
                  <div className="w-full space-y-2">
                    <p>Kecamatan</p>
                    <InputComponent
                      typeInput="selectSearch"
                      valueInput={searchKecamatanInput}
                      onChangeInputSearch={(e) =>
                        setSearchKecamatanInput(e.target.value)
                      }
                      items={resultKec}
                      label="Kecamatan"
                      placeholder="Pilih Kecamatan"
                      value={kecamatan || userData.kecamatan_id}
                      onChange={(e: any) => setKecamatan(e)}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <p>Desa</p>
                    <InputComponent
                      typeInput="selectSearch"
                      valueInput={searchVillageInput}
                      onChangeInputSearch={(e) =>
                        setSearchVillageInput(e.target.value)
                      }
                      items={resultDesa}
                      label="Desa"
                      placeholder="Pilih Desa"
                      value={village || userData.desa_id}
                      onChange={(e: any) => setVillage(e)}
                    />
                  </div>
                </div>
                <div className="flex gap-x-4">
                  <div className="w-full space-y-2">
                    <p>RT</p>
                    <InputComponent value={userData.rt} />
                  </div>
                  <div className="w-full space-y-2">
                    <p>RW</p>
                    <InputComponent value={userData.rw} />
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <p>Alamat</p>
                  <InputComponent
                    typeInput="textarea"
                    value={userData.alamat}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between gap-x-10">
                <div className="w-1/2 space-y-4">
                  <h1 className="text-xl font-semibold mb-4">Data Diri</h1>
                  <div className="space-y-2">
                    <p>Nama</p>
                    <InputComponent
                      value={form.name}
                      name="name"
                      onChange={handleChangeUserData}
                    />
                  </div>
                  <div className="space-y-2">
                    <p>NIK</p>
                    <InputComponent
                      value={form.nik}
                      name="nik"
                      onChange={handleChangeUserData}
                    />
                  </div>
                  <div className="space-y-2">
                    <p>Nomor Telepon</p>
                    <InputComponent
                      value={form.telepon}
                      name="telepon"
                      onChange={handleChangeUserData}
                    />
                  </div>
                  <div className="space-y-2">
                    <p>Email</p>
                    <InputComponent
                      value={form.email}
                      name="email"
                      type="email"
                      onChange={handleChangeUserData}
                    />
                  </div>
                </div>
                <div className="w-1/2 space-y-4">
                  <h1 className="text-xl font-semibold mb-4">Alamat</h1>
                  <div className="flex gap-x-4">
                    <div className="w-full space-y-2">
                      <p>Kecamatan</p>
                      <InputComponent
                        typeInput="selectSearch"
                        valueInput={searchKecamatanInput}
                        onChangeInputSearch={(e) =>
                          setSearchKecamatanInput(e.target.value)
                        }
                        items={resultKec}
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan"
                        value={kecamatan}
                        onChange={(e: any) => setKecamatan(e)}
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <p>Desa</p>
                      <InputComponent
                        typeInput="selectSearch"
                        valueInput={searchVillageInput}
                        onChangeInputSearch={(e) =>
                          setSearchVillageInput(e.target.value)
                        }
                        items={resultDesa}
                        label="Desa"
                        placeholder="Pilih Desa"
                        value={village}
                        onChange={(e: any) => setVillage(e)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-4">
                    <div className="w-full space-y-2">
                      <p>RT</p>
                      <InputComponent
                        value={form.rt}
                        name="rt"
                        onChange={handleChangeUserData}
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <p>RW</p>
                      <InputComponent
                        value={form.rw}
                        name="rw"
                        onChange={handleChangeUserData}
                      />
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <p>Alamat</p>
                    <InputComponent
                      typeInput="textarea"
                      name="alamat"
                      value={form.alamat}
                      onChange={handleChangeUserData}
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCreateUser}
                className="w-full bg-primary-700 rounded-full hover:bg-primary-800 mt-7"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Submit"}
              </Button>
            </>
          )}
        </div>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-8 p-8">
          <div className="flex justify-between gap-x-10">
            <div className="w-full space-y-4">
              <h1 className="text-xl font-semibold mb-4">Formulir</h1>
              {resultForm.map((v) => (
                <div className="space-y-2" key={v.id}>
                  <p>
                    {v.field}
                    <span className="text-error-700 ml-1">
                      {v.isrequired ? "*" : ""}
                    </span>
                  </p>

                  {v.tipedata === "radio" ? (
                    <RadioGroup
                      className="flex space-x-4"
                      onValueChange={(value) => handleChange(v.id, value)}
                    >
                      {v.datajson?.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={option.id} id={option.key} />
                          <Label htmlFor={option.key}>{option.key}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : v.tipedata === "checkbox" ? (
                    <div className="flex space-x-4">
                      {v.datajson?.map((option) => (
                        <div
                          key={option.id}
                          className="space-x-2 flex items-center"
                        >
                          <input
                            type="checkbox"
                            id={option.key}
                            checked={
                              !!(
                                formValues[v.id] &&
                                (formValues[v.id] as Record<string, boolean>)[
                                  option.id
                                ]
                              )
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              handleChange(v.id, {
                                ...(formValues[v.id] as Record<
                                  string,
                                  boolean
                                >),
                                [option.id]: checked,
                              });
                            }}
                          />
                          <Label htmlFor={option.key}>{option.key}</Label>
                        </div>
                      ))}
                    </div>
                  ) : v.tipedata === "textarea" ? (
                    <Textarea
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleChange(v.id, e.target.value)
                      }
                      className="w-full h-40 p-2 border rounded-md"
                    />
                  ) : (
                    <Input
                      type={v.tipedata}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(v.id, e.target.value)
                      }
                      className="rounded-full w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-8 p-8">
          <h1 className="text-xl font-semibold mb-4">Dokumen</h1>
          {resultDocs.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between w-full rounded-[20px] py-6 px-4 bg-neutral-50 mb-4"
            >
              <div className="w-11/12 space-y-2">
                <h3 className="font-semibold text-[16px] text-primary-800">
                  {v.field}{" "}
                  <span className="text-error-700 ml-1">
                    {v.isrequired ? "*" : ""}
                  </span>
                </h3>
              </div>
              <div>
                <InputComponent
                  typeInput="upload"
                  label={docValues[v.id] ? docValues[v.id]?.name : "Upload"}
                  onChange={(e) =>
                    handleDocChange(
                      v.id,
                      e.target.files ? e.target.files[0] : null,
                    )
                  }
                  required={v.isrequired}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-right mt-5">
          <Button
            className="bg-success-700 hover:bg-primary-800 w-[140px] rounded-full"
            onClick={handleSubmit}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Validasi"}
          </Button>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateOffline;
