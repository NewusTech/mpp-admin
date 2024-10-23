"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { RichTextDisplay } from "@/components/RichTextDisplay";
import Image from "next/image";
import AlertDialogCreateInformation from "@/app/(root)/master/master-instance/information/[id]/Dialog";

const InfromationInsantce = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/infoinstansi/get/${params.id}`,
    fetcher
  );

  const result = data?.data?.Infoinstansi;
  const result2 = data?.data;

  console.log("1", result);
  console.log("2", result2);

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-between items-center mb-8">
          <p className="font-bold text-xl">{result2?.name}</p>
          <AlertDialogCreateInformation id={params.id} />
        </div>
        <div className="w-full shadow p-4 rounded-xl space-y-4">
          <div>
            <p className="font-semibold">Title</p>
            <p>{result?.title}</p>
          </div>
          <div>
            <p className="font-semibold">Konten</p>
            <RichTextDisplay content={result?.content} />
          </div>
          <div>
            <p className="font-semibold">Gambar</p>
            {result?.image ? (
              <Image src={result?.image} alt="admin" width={100} height={100} />
            ) : (
              <p>Tidak ada gambar</p>
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default InfromationInsantce;
