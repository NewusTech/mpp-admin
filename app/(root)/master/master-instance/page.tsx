"use client";

import { dataInstanceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { DataInstance } from "@/types/type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

const MasterInsantce = () => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?limit=1000000`,
    fetcher,
  );
  const result = data?.data;
  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <Link href="/master/master-instance/create">
            <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
              Tambah
            </Button>
          </Link>
        </div>
        {result && (
          <DataTables
            columns={dataInstanceColumns}
            data={result}
            filterBy="name"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default MasterInsantce;
