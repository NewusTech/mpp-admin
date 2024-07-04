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
        toast(data.message);
        router.push("/complaint");
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["Admin Instansi", "Staff Instansi"]}>
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
          <h1 className="font-medium">Nama</h1>
          <p className="text-sm">NIK</p>
          <div className="space-y-3 mt-8">
            <Instance title="Instansi" name={result?.Instansi?.name} />
            <Instance title="Layanan" name={result?.Layanan?.name} />
            <Instance title="Judul Pengaduan" name={result?.judul} />
            <Instance title="Aduan" name={result?.aduan} />
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
                disabled={loading ? true : false}
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
