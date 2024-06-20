"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ServiceValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import FileUploader from "@/components/FileUploader";
import MyEditor from "@/components/Editor";
import InputComponent from "@/components/InputComponent";

export default function AlertDialogCreateService() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const editor = useRef<{ getContent: () => string }>(null);
  const [selectedInstansi, setSelectedInstansi] = useState("");
  const [namaLayanan, setNamaLayanan] = useState("");
  const [status, setStatus] = useState("1");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input

  const content1 = editor.current?.getContent();

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const result = data?.data;

  // 2. Define a submit handler.
  async function onSubmit() {
    const formData = {
      name: namaLayanan,
      instansi_id: Number(selectedInstansi),
      desc: content1,
      status: Number(status),
    };

    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/create`,
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
      toast(data.message);
      console.log(data);
      handleAddModalClose();
    } catch (error: any) {
      toast(error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
        >
          Tambah
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto h-full w-full">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Tambah Layanan
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Instansi</Label>
            <InputComponent
              typeInput="selectSearch"
              valueInput={searchInputInstance}
              onChangeInputSearch={(e) =>
                setSearchInputInstance(e.target.value)
              }
              items={result}
              label="Instansi"
              placeholder="Pilih Instansi"
              value={selectedInstansi}
              onChange={(e: any) => setSelectedInstansi(e)}
            />
          </div>
          <div className="space-y-2">
            <Label>Nama Layanan</Label>
            <Input
              className="rounded-full"
              type="text"
              placeholder="Masukkan Layanan"
              value={namaLayanan}
              onChange={(e) => setNamaLayanan(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Informasi Layanan</Label>
            <MyEditor ref={editor} name="editor" initialValue="Deskripsi" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              className="flex space-x-2"
              value={status}
              onValueChange={(value) => setStatus(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="aktif" />
                <Label htmlFor="aktif">Aktif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="tidak" />
                <Label htmlFor="tidak">Tidak Aktif</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <AlertDialogFooter className="p-6">
          <AlertDialogCancel
            onClick={handleAddModalClose}
            className="bg-transparent border border-primary-700 rounded-full hover:bg-primary-700 hover:text-neutral-50 text-primary-700"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={onSubmit}
            className="bg-primary-700 hover:bg-primary-800 rounded-full"
          >
            Tambah
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
