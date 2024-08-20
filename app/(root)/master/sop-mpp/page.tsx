import { sopMppColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { SOPMPP } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateSOPMPP from "@/app/(root)/master/sop-mpp/DialogForm";

async function getData(): Promise<SOPMPP> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/sop/get`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

const MasterSOPMPP = async () => {
  const data = await getData();
  const result: SOPMPP[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateSOPMPP />
        </div>
        <DataTables columns={sopMppColumns} data={result} filterBy="desc" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterSOPMPP;
