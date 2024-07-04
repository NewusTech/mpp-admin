import { flowBookingColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { FlowBooking } from "@/types/type";
import AlertDialogCreateMasterFlowBooking from "@/app/(root)/master/flow-booking/DialogForm";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<FlowBooking[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alurbooking/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterFlowBooking = async () => {
  const data = await getData();

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateMasterFlowBooking />
        </div>
        <DataTables columns={flowBookingColumns} data={data} filterBy="desc" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterFlowBooking;
