import { videoColumns, VisionMissionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Video, VisionMission } from "@/types/type";
import AlertDialogCreateVisionMission from "@/app/(root)/master/vision-mission/DialogForm";
import AlertDialogCreateVideo from "@/app/(root)/master/video/DialogForm";

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
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <AlertDialogCreateVideo />
      </div>
      <DataTables columns={videoColumns} data={result} filterBy="video" />
    </section>
  );
};

export default MasterVisionMission;
