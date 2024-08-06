import { flowColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Slider } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<Slider[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alurmpp/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterFlow = async () => {
  const data = await getData();
  const result = data;

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <DataTables
          columns={flowColumns}
          data={result}
          filterBy="image"
          type="requirement"
        />
      </section>
    </ProtectedRoute>
  );
};

export default MasterFlow;
