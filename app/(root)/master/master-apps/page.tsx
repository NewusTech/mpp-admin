import { dataAppsColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { DataApps } from "@/types/type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<DataApps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/aplikasietc/get?limit=1000000`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterApps = async () => {
  const data = await getData();
  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <Link href="/master/master-apps/create">
            <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
              Tambah
            </Button>
          </Link>
        </div>
        <DataTables columns={dataAppsColumns} data={data} filterBy="name" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterApps;
