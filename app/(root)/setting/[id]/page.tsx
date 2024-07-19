"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import MyEditor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader } from "lucide-react";

const CreateFormat = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/detailsurat/${params.id}`,
    fetcher
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const result = data?.data?.Layanansurat;

  const editor1Ref = useRef<{ getContent: () => string }>(null);
  const editor2Ref = useRef<{ getContent: () => string }>(null);
  const editor3Ref = useRef<{ getContent: () => string }>(null);
  const editor4Ref = useRef<{ getContent: () => string }>(null);
  const editor5Ref = useRef<{ getContent: () => string }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const content1 = editor1Ref.current?.getContent();
    const content2 = editor2Ref.current?.getContent();
    const content3 = editor3Ref.current?.getContent();
    const content4 = editor4Ref.current?.getContent();
    const content5 = editor5Ref.current?.getContent();

    const payload = {
      header: content1,
      body: content2,
      instansi_pj: content3,
      nip_pj: content4,
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
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast(result.message);
        router.push("/setting");
      }
    } catch (error: any) {
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Admin Layanan"]}>
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
            <label htmlFor="editor3">Penanggung Jawab</label>
            <MyEditor
              ref={editor3Ref}
              name="editor3"
              initialValue={result?.instansi_pj || "<p>Ketik disni</p>"}
            />
          </div>
          <div className="bg-white shadow px-4 py-8 space-y-4 rounded-[10px]">
            <label htmlFor="editor4">NIP Penanggung Jawab</label>
            <MyEditor
              ref={editor4Ref}
              name="editor4"
              initialValue={result?.nip_pj || "<p>Ketik disni</p>"}
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
