import InputComponent from "@/components/InputComponent";
import { dataInstanceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { DataInstance } from "@/types/type";
import AlertDialogCreateInstance from "@/app/(root)/master/master-instance/DialogForm";

async function getData(): Promise<DataInstance[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterInsantce = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <AlertDialogCreateInstance />
      </div>
      <DataTables columns={dataInstanceColumns} data={data} filterBy="name" />
    </section>
  );
};

export default MasterInsantce;
