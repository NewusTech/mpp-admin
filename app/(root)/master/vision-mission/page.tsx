import { VisionMissionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { VisionMission } from "@/types/type";
import AlertDialogCreateVisionMission from "@/app/(root)/master/vision-mission/DialogForm";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<VisionMission> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/visimisi/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterVisionMission = async () => {
  const data = await getData();
  const result: VisionMission[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateVisionMission />
        </div>
        <DataTables
          columns={VisionMissionColumns}
          data={result}
          filterBy="misi"
        />
      </section>
    </ProtectedRoute>
  );
};

export default MasterVisionMission;
