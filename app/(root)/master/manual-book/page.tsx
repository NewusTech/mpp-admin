import { manualBookColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { ManualBook } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateMasterManualBook from "@/app/(root)/master/manual-book/DialogForm";

async function getData(): Promise<ManualBook> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/manualbook/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterManualBook = async () => {
  const data = await getData();
  const result: ManualBook[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateMasterManualBook />
        </div>
        <DataTables
          columns={manualBookColumns}
          data={result}
          filterBy="dokumen"
        />
      </section>
    </ProtectedRoute>
  );
};

export default MasterManualBook;
