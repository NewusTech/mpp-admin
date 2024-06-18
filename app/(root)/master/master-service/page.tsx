import InputComponent from "@/components/InputComponent";
import { dataServiceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { DataServices } from "@/types/type";
import AlertDialogCreateService from "@/app/(root)/master/master-service/DialogForm";

async function getData(): Promise<DataServices[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterService = async () => {
  const data = await getData();

  console.log(data);
  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <AlertDialogCreateService />
      </div>
      <DataTables columns={dataServiceColumns} data={data} filterBy={"name"} />
    </section>
  );
};

export default MasterService;
