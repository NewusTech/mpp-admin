"use client";

import InputComponent from "@/components/InputComponent";
import { manageUserColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { ManageUser as User } from "@/types/type";
import Cookies from "js-cookie";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

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
        <AlertDialogPopup
          title="Tambah"
          style="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
          header="Tambah User"
          content={
            <>
              <div className="pt-6 px-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="font-normal">Nama</p>
                    <InputComponent />
                  </div>
                  <div className="space-y-2">
                    <p className="font-normal">Email</p>
                    <InputComponent />
                  </div>
                  <div className="space-y-2">
                    <p className="font-normal">Role</p>
                    <InputComponent />
                  </div>
                  <div className="space-y-2">
                    <p className="font-normal">Status</p>
                    <InputComponent typeInput="select" />
                  </div>
                </div>
              </div>
            </>
          }
        />
      </div>
      {result && (
        <DataTables columns={manageUserColumns} data={result} filterBy="name" />
      )}
    </section>
  );
};

export default ManageUser;
