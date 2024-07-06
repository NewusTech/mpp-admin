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
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MyEditor from "@/components/Editor";

export default function AlertDialogCreateService({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const editor = useRef<{ getContent: () => string }>(null);
  const editor1 = useRef<{ getContent: () => string }>(null);
  const editor2 = useRef<{ getContent: () => string }>(null);
  const [namaLayanan, setNamaLayanan] = useState("");
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState<boolean>(false);

  const content1 = editor.current?.getContent();
  const content2 = editor1.current?.getContent();
  const content3 = editor2.current?.getContent();

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  // 2. Define a submit handler.
  async function onSubmit() {
    setLoading(true);
    const formData = {
      name: namaLayanan,
      instansi_id: id,
      desc: content1,
      dasarhukum: content2,
      syarat: content3,
      status: Number(status),
    };

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
      if (response.ok) {
        toast(data.message);
        handleAddModalClose();
      }
    } catch (error: any) {
      toast(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
      <AlertDialogContent className="p-0 border-0 overflow-auto h-full max-w-[80%]">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Tambah Layanan
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6 space-y-5">
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
            <Label>Pelayanan</Label>
            <MyEditor ref={editor} name="editor" initialValue="Deskripsi" />
          </div>
          <div className="space-y-2">
            <Label>Dasar Hukum</Label>
            <MyEditor ref={editor1} name="editor1" initialValue="Dasar hukum" />
          </div>
          <div className="space-y-2">
            <Label>Persyaratan</Label>
            <MyEditor ref={editor2} name="editor2" initialValue="persyaratan" />
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
            disabled={loading ? true : false}
          >
            {loading ? <Loader className="animate-spin" /> : "Tambah"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
