"use client";

import MyEditor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ServiceForm = ({
  type,
  data,
  label,
  id,
}: {
  type?: string;
  data?: any;
  label: string;
  id?: number;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [namaLayanan, setNamaLayanan] = useState("");
  const [status, setStatus] = useState("");
  const [online, setOnline] = useState("");
  const [offline, setOffline] = useState("");
  const router = useRouter();

  const editor1Ref = useRef<{ getContent: () => string }>(null);
  const editor2Ref = useRef<{ getContent: () => string }>(null);
  const editor3Ref = useRef<{ getContent: () => string }>(null);

  useEffect(() => {
    if (data) {
      setNamaLayanan(data?.name);
      setOnline(data?.active_online ? "1" : "0");
      setOffline(data?.active_offline ? "1" : "0");
      setStatus(data?.status ? "1" : "0");
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const content1 = editor1Ref.current?.getContent();
    const content2 = editor2Ref.current?.getContent();
    const content3 = editor3Ref.current?.getContent();

    const payload = {
      name: namaLayanan,
      desc: content1,
      instansi_id: id,
      dasarhukum: content2,
      syarat: content3,
      status: status,
      active_offline: offline,
      active_online: online,
    };

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          toast(result.message);
          router.push("/master/master-service");
        }
      } catch (error: any) {
        toast(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/update/${data?.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          toast(result.message);
          router.push("/master/master-service");
        }
      } catch (error: any) {
        toast(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    console.log(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="space-y-4">
        <label htmlFor="editor1">Pelayanan</label>
        <MyEditor
          ref={editor1Ref}
          name="editor1"
          initialValue={data?.desc || "Ketik disini"}
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="editor2">Dasar Hukum</label>
        <MyEditor
          ref={editor2Ref}
          name="editor2"
          initialValue={data?.dasarhukum || "Ketik disini"}
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="editor3">Penanggung Jawab</label>
        <MyEditor
          ref={editor3Ref}
          name="editor3"
          initialValue={data?.syarat || "Ketik disini"}
        />
      </div>
      <div className="space-y-5">
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
        <div className="space-y-2">
          <Label>Aktifkan Layanan Online</Label>
          <RadioGroup
            className="flex space-x-2"
            value={online}
            onValueChange={(value) => setOnline(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="aktifOnline" />
              <Label htmlFor="aktifOnline">Aktif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="tidakAktifOnline" />
              <Label htmlFor="tidakAktifOnline">Tidak Aktif</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Aktifkan Layanan Offline</Label>
          <RadioGroup
            className="flex space-x-2"
            value={offline}
            onValueChange={(value) => setOffline(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="aktifOffline" />
              <Label htmlFor="aktifOffline">Aktif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="tidakAktifOffline" />
              <Label htmlFor="tidakAktifOffline">Tidak Aktif</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="text-right">
        <Button
          type="submit"
          className="rounded-full bg-primary-700 hover:bg-primary-800"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : label}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
