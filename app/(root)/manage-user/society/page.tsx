"use client";

import { manageUserColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const ManageUser = () => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alluserinfo/get?limit=1000000&role=5`,
    fetcher,
  );

  const result = data?.data;

  return (
    <ProtectedRoute
      roles={[
        "Super Admin",
      ]}
    >
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <Link href="/manage-user/society/create">
            <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
              Tambah
            </Button>
          </Link>
        </div>
        {result && (
          <DataTables
            columns={manageUserColumns}
            data={result}
            filterBy="name"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default ManageUser;
