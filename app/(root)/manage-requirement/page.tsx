import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { manageRequirementColumns } from "@/constants";
import Link from "next/link";
import { ManageRequirements as Requirement } from "@/types/type";

async function getData(): Promise<Requirement[]> {
  return [
    {
      id: 1,
      instance: "Bina Marga",
      service: "Kelola Jalan",
    },
    // ...
  ];
}

const ManageRequirements = async () => {
  const data = await getData();

  return (
    <section className="mr-16">
      <div>
        <h1 className="text-lg font-semibold">Kelola Persyaratan</h1>
        <div className="flex justify-between mt-4">
          <div className="w-1/2">
            <InputComponent typeInput="select" />
          </div>
          <Link href="/manage-requirement/create">
            <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
              Tambah
            </Button>
          </Link>
        </div>
        <DataTables columns={manageRequirementColumns} data={data} />
      </div>
    </section>
  );
};

export default ManageRequirements;
