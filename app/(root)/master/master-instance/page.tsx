import { dataInstanceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { DataInstance } from "@/types/type";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(): Promise<DataInstance[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?limit=1000000`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterInsantce = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <Link href="/master/master-instance/create">
          <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
            Tambah
          </Button>
        </Link>
      </div>
      <DataTables columns={dataInstanceColumns} data={data} filterBy="name" />
    </section>
  );
};

export default MasterInsantce;
