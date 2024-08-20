import { announcementColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Announcement } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateAnnouncement from "@/app/(root)/master/announcement/DialogForm";

async function getData(): Promise<Announcement> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/pengumuman/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterAnnouncement = async () => {
  const data: any = await getData();
  const result: Announcement[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateAnnouncement />
        </div>
        <DataTables
          columns={announcementColumns}
          data={result}
          filterBy="file"
        />
      </section>
    </ProtectedRoute>
  );
};

export default MasterAnnouncement;
