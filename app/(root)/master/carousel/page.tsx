import { carouselColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Facility } from "@/types/type";
import AlertDialogCreateCarousel from "@/app/(root)/master/carousel/DialogForm";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<Facility[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/carousel/get?limit=100`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterCarousel = async () => {
  const data = await getData();
  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateCarousel />
        </div>
        <DataTables columns={carouselColumns} data={data} filterBy="image" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterCarousel;
