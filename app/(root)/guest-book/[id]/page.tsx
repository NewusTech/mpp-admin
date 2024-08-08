"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { detailGuestBook, fetcher } from "@/lib/fetch";
import ProtectedRoute from "@/components/ProtectedRoute";

const Card = ({ label, value }: { label: string; value?: string | null }) => {
  return (
    <div className="space-y-2 mt-3">
      <p className="font-medium">{label}</p>
      <div className="w-full rounded-[20px] bg-neutral-50 border border-neutral-700 p-4">
        <p className="text-neutral-800">{value}</p>
      </div>
    </div>
  );
};

const DetailGuestBook = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/bukutamu/get/${params.id}`,
    fetcher,
  );
  const result = data?.data;
  // const resultGeustBook = detailGuestBook.data;

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
          <Link href="/guest-book">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
          <h2 className="text-lg font-semibold my-5">Detail Buku Tamu</h2>
          <Card label="Nama" value={result?.name} />
          <Card label="Pekerjaan" value={result?.pekerjaan} />
          <Card label="Alamat" value={result?.alamat} />
          <Card label="Tujuan" value={result?.tujuan || "Tidak diisi"} />
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default DetailGuestBook;
