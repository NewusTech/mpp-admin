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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CreateFormat = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data, mutate } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/detailsertif/${params.id}`,
    fetcher
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pj, setPj] = useState("");
  const [nipPj, setNipPj] = useState("");
  const [perihal, setPerihal] = useState("");
  const [nomor, setNomor] = useState("");
  const router = useRouter();
  const [editorData, setEditorData] = useState("");
  const editor1Ref = useRef<{ getContent: () => string }>(null);
  const editor2Ref = useRef<{ getContent: () => string }>(null);
  const editor5Ref = useRef<{ getContent: () => string }>(null);
  const editor6Ref = useRef<{ getContent: () => string }>(null);

  const result = data?.data?.Layanansertif;
  const resultPj = data?.data?.Instansi;

  console.log(result);

  useEffect(() => {
    if (resultPj || result) {
      setPj(resultPj?.pj);
      setNipPj(resultPj?.nip_pj);
      setNomor(result?.nomor);
      setPerihal(result?.perihal);
      setEditorData(result?.body);
    }
  }, [resultPj, result]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const content1 = editor1Ref.current?.getContent();
    const content2 = editor2Ref.current?.getContent();
    const content5 = editor5Ref.current?.getContent();
    const content6 = editor6Ref.current?.getContent();

    const payload = {
      header: content1,
      body: editorData,
      instansi_pj: pj,
      nip_pj: nipPj,
      nomor: nomor,
      perihal: perihal,
      cataan: content2,
      tembusan: content6,
      footer: content5,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/editsertif/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(payload),
        }
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
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow px-4 py-8 space-y-5 rounded-[10px]"
        >
          <div className="space-y-3">
            <label htmlFor="editor1">Kepala Surat</label>
            <MyEditor
              ref={editor1Ref}
              name="editor1"
              initialValue={result?.header || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="body">Body Surat</label>
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data);
              }}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="body">Penanggung Jawab</label>
            <Input
              placeholder="Masukkan penangung jawab"
              value={pj}
              onChange={(e) => setPj(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="body">NIP Penanggung Jawab</label>
            <Input
              placeholder="Masukkan nip penangung jawab"
              value={nipPj}
              onChange={(e) => setNipPj(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="body">Nomor</label>
            <Input
              placeholder="Masukkan nomor"
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="body">Perihal</label>
            <Input
              placeholder="Masukkan perihal"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="editor6">Catatan</label>
            <MyEditor
              ref={editor2Ref}
              name="editor6"
              initialValue={result?.catatan || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="editor7">Tembusan</label>
            <MyEditor
              ref={editor6Ref}
              name="editor7"
              initialValue={result?.tembusan || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="editor5">Footer</label>
            <MyEditor
              ref={editor5Ref}
              name="editor5"
              initialValue={result?.footer || "<p>Ketik disni</p>"}
            />
          </div>
          <Button
            type="submit"
            className="rounded-full w-full bg-primary-700 hover:bg-primary-800"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </section>
    </ProtectedRoute>
  );
};

export default CreateFormat;
