import { videoColumns, VisionMissionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Video } from "@/types/type";
import AlertDialogCreateVideo from "@/app/(root)/master/video/DialogForm";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<Video> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/video/get`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

const MasterVisionMission = async () => {
  const data = await getData();
  const result: Video[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateVideo />
        </div>
        <DataTables columns={videoColumns} data={result} filterBy="video" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterVisionMission;
