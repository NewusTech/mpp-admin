import { maklumatColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Maklumat } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateMaklumat from "@/app/(root)/master/maklumat/DialogForm";

async function getData(): Promise<Maklumat> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/maklumat/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterMaklumat = async () => {
  const data: any = await getData();
  const result: Maklumat[] = [data?.maklumat];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateMaklumat />
        </div>
        <DataTables columns={maklumatColumns} data={result} filterBy="desc" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterMaklumat;
