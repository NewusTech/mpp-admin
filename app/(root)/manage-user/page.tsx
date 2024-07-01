"use client";

import InputComponent from "@/components/InputComponent";
import { manageUserColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { ManageUser as User } from "@/types/type";
import Cookies from "js-cookie";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// async function getData(): Promise<User[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/user/alluserinfo/get?limit=1000000`,
//     {
//       cache: "no-store",
//       headers: {
//         Authorization: `Bearer ${Cookies.get("token")}`,
//       },
//     },
//   );
//   const data = await res.json();
//   return data;
// }

const ManageUser = () => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alluserinfo/get?limit=1000000`,
    fetcher,
  );

  const result = data?.data;

  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <Link href="/manage-user/create">
          <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
            Tambah
          </Button>
        </Link>
      </div>
      {result && (
        <DataTables columns={manageUserColumns} data={result} filterBy="name" />
      )}
    </section>
  );
};

export default ManageUser;
