"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import MyEditor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";

const CreateFormat = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data, mutate } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/detailsurat/${params.id}`,
    fetcher,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pj, setPj] = useState("");
  const [nipPj, setNipPj] = useState("");
  const [perihal, setPerihal] = useState("");
  const [nomor, setNomor] = useState("");
  const router = useRouter();

  const result = data?.data?.Layanansurat;
  const resultPj = data?.data?.Instansi;

  useEffect(() => {
    if (resultPj || result) {
      setPj(resultPj.pj);
      setNipPj(resultPj.nip_pj);
      setNomor(result.nomor);
      setPerihal(result.perihal);
    }
  }, [resultPj, result]);

  console.log(result);

  const editor1Ref = useRef<{ getContent: () => string }>(null);
  const editor2Ref = useRef<{ getContent: () => string }>(null);
  const editor5Ref = useRef<{ getContent: () => string }>(null);
  const editor6Ref = useRef<{ getContent: () => string }>(null);
  const editor7Ref = useRef<{ getContent: () => string }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const content1 = editor1Ref.current?.getContent();
    const content2 = editor2Ref.current?.getContent();
    const content5 = editor5Ref.current?.getContent();
    const content6 = editor6Ref.current?.getContent();
    const content7 = editor7Ref.current?.getContent();

    const payload = {
      header: content1,
      body: content2,
      instansi_pj: pj,
      nip_pj: nipPj,
      nomor: nomor,
      perihal: perihal,
      cataan: content6,
      tembusan: content7,
      footer: content5,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/editsurat/${params.id}`,
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
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${result.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        await mutate();
        router.push("/setting");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Submit",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="-ml-14 mb-10 w-12 h-12">
          <Link href="/setting">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label htmlFor="editor1">Kepala Surat</label>
            <MyEditor
              ref={editor1Ref}
              name="editor1"
              initialValue={result?.header || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label htmlFor="editor2">Body Surat</label>
            <MyEditor
              ref={editor2Ref}
              name="editor2"
              initialValue={result?.body || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label>Penanggung Jawab</label>
            <Input
              type="text"
              className="rounded-full"
              placeholder="Masukkan penanggung jawab"
              value={pj}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPj(e.target.value)
              }
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label>NIP Penanggung Jawab</label>
            <Input
              type="text"
              className="rounded-full"
              placeholder="Masukkan nik penanggung jawab"
              value={nipPj}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNipPj(e.target.value)
              }
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label>Nomor</label>
            <Input
              type="text"
              className="rounded-full"
              placeholder="Masukkan nik penanggung jawab"
              value={nomor}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNomor(e.target.value)
              }
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label>Perihal</label>
            <Input
              type="text"
              className="rounded-full"
              placeholder="Masukkan nik penanggung jawab"
              value={perihal}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPerihal(e.target.value)
              }
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label htmlFor="editor6">Catatan</label>
            <MyEditor
              ref={editor6Ref}
              name="editor6"
              initialValue={result?.catatan || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label htmlFor="editor7">Tembusan</label>
            <MyEditor
              ref={editor7Ref}
              name="editor7"
              initialValue={result?.tembusan || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label htmlFor="editor5">Footer</label>
            <MyEditor
              ref={editor5Ref}
              name="editor5"
              initialValue={result?.footer || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="text-right">
            <Button
              type="submit"
              className="rounded-full bg-primary-700 hover:bg-primary-800"
              disabled={isLoading ? true : false}
            >
              {isLoading ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      </section>
    </ProtectedRoute>
  );
};

export default CreateFormat;
