"use client";

import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Swal from "sweetalert2";

interface UserFileItemProps {
  label: string;
  value: string;
}

const PopupImage = ({ label, value }: UserFileItemProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-full h-full mb-3">
          <Image src={value} alt={label} width={160} height={160} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[50%] overflow-auto">
        <div className="w-full h-full p-4">
          <Image src={value} alt={label} width={1000} height={1000} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Instance = ({ title, name }: { title: string; name: string }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{title}</h3>
      <div className="w-full rounded-full bg-neutral-300 px-4 py-2 border border-neutral-700 text-neutral-700 text-sm">
        {name}
      </div>
    </div>
  );
};

export default function DetailComplaint({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/pengaduan/get/${params.id}`,
    fetcher,
  );

  const result = data?.data;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/pengaduan/update/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ jawaban: reply, status: 4 }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        router.push("/complaint");
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(result);

  return (
    <ProtectedRoute
      roles={[
        "Admin Instansi",
        "Admin Layanan",
        "Admin Verifikasi",
        "Super Admin",
      ]}
    >
      <section className="mr-16">
        <div className="-ml-14 mb-5">
          <Link href="/complaint">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="rounded-[20px] w-full bg-neutral-200 p-8">
          <h1 className="font-medium">{result?.Userinfo?.name}</h1>
          <p className="text-sm">{result?.Userinfo?.nik}</p>
          <div className="space-y-3 mt-8">
            <Instance title="Instansi" name={result?.Instansi?.name} />
            <Instance title="Layanan" name={result?.Layanan?.name} />
            <Instance title="Judul Pengaduan" name={result?.judul} />
            <Instance title="Aduan" name={result?.aduan} />
            <div className="space-y-3 my-3">
              <h3 className="font-medium">Foto</h3>
              {result?.image ? (
                <PopupImage label="image" value={result?.image} />
              ) : (
                <p>Tidak ada</p>
              )}
            </div>
          </div>
          <div className="mt-8 space-y-2">
            <h3 className="font-medium">Balasan</h3>
            <Textarea
              className="h-40 rounded-[16px]"
              placeholder="masukkan balasan"
              value={reply || result?.jawaban}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                className="bg-primary-700 mt-4 hover:bg-primary-800 rounded-full px-8"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Kirim"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
