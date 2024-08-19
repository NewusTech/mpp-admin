"use client";

import { DataTables } from "@/components/Datatables";
import { layananFileColumns } from "@/constants";
import ProtectedRoute from "@/components/ProtectedRoute";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import AlertDialogCreateLayananFile from "@/app/(root)/master/master-service/file/[id]/Dialog";

const FilePage = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layananfile/get/${params.id}`,
    fetcher,
  );

  const result = data?.data?.Layananfiles;

  console.log(result);

  return (
    <ProtectedRoute
      roles={[
        "Admin Instansi",
        "Admin Verifikasi",
        "Super Admin",
        "Admin Layanan",
      ]}
    >
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateLayananFile id={params.id} />
        </div>
        {result && (
          <DataTables
            columns={layananFileColumns}
            data={result}
            filterBy="name"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default FilePage;
