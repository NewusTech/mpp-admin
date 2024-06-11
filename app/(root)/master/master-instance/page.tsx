import InputComponent from "@/components/InputComponent";
import { dataInstanceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { DataInstance } from "@/types/type";

async function getData(): Promise<DataInstance[]> {
  return [
    {
      id: 1,
      no: 3,
      instance: "Dinas PUPR",
    },
    // ...
  ];
}

const MasterInsantce = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
          <InputComponent />
        </div>
        <AlertDialogPopup
          title="Tambah"
          style="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
          header="Tambah Instansi"
          content={
            <>
              <div className="p-6 space-y-2">
                <p className="font-normal">Nama Instansi</p>
                <InputComponent />
              </div>
            </>
          }
        />
      </div>
      <DataTables columns={dataInstanceColumns} data={data} />
    </section>
  );
};

export default MasterInsantce;
