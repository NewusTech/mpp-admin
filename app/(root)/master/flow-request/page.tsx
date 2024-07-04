import { flowRequestColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { FlowBooking } from "@/types/type";
import AlertDialogCreateMasterFlowRequest from "@/app/(root)/master/flow-request/DialogForm";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<FlowBooking[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alurpermohonan/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterFlowRequest = async () => {
  const data = await getData();

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateMasterFlowRequest />
        </div>
        <DataTables columns={flowRequestColumns} data={data} filterBy="desc" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterFlowRequest;
