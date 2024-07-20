import { termAndConditionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { TermAndCondition } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateTermAndCondition from "@/app/(root)/master/term-and-condition/DialogForm";

async function getData(): Promise<TermAndCondition> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/termcond/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterTermAndCondition = async () => {
  const data = await getData();
  const result: TermAndCondition[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateTermAndCondition />
        </div>
        <DataTables
          columns={termAndConditionColumns}
          data={result}
          filterBy="desc"
        />
      </section>
    </ProtectedRoute>
  );
};

export default MasterTermAndCondition;
