"use client";

import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ModalValidate from "@/components/Dialog/modal-validate";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

const DetailRequestOnline = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/detail/${params.id}`,
    fetcher,
  );

  const result = data?.data;

  const filteredData = result?.filter(
    (item: any) => item.layananform_tipedata !== "file",
  );

  const filteredDataFile = result?.filter(
    (item: any) => item.layananform_tipedata === "file",
  );

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Extract filename and extension from URL
  const getFileNameFromUrl = (url: string) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/request/online">
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
        <h1 className="text-xl font-semibold mb-1">Nama</h1>
        <h4 className="text-[16px] text-neutral-900">Jenis Layanan</h4>
        <h2 className="text-lg font-semibold my-5">Formulir</h2>
        {filteredData?.map((v: any) => (
          <div className="space-y-2 mt-3" key={v.id}>
            <p>{v.layananform_name}</p>
            <div className="w-full rounded-[20px] bg-neutral-50 border border-neutral-700 p-4">
              <p className="text-neutral-700">{v.data}</p>
            </div>
          </div>
        ))}
        <h2 className="text-lg font-semibold my-5">Dokumen</h2>
        {filteredDataFile?.map((v: any) => (
          <div className="space-y-2 mt-3" key={v.id}>
            <p>{v.layananform_name}</p>
            <Button
              onClick={() => handleDownload(v.data, getFileNameFromUrl(v.data))}
              className="mt-2 w-[60vh] rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-around items-center"
            >
              <Image
                src="/icons/download.svg"
                alt="download"
                width={24}
                height={24}
              />
              <p className="text-neutral-900">{v.layananform_name}</p>
            </Button>
          </div>
        ))}
        <div className="text-center mt-8 mb-[46px] space-x-3">
          <ModalValidate title="Tidak Sesuai" />
          <Button className="bg-success-700 hover:bg-success-800 w-[140px] rounded-full">
            Validasi
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DetailRequestOnline;
