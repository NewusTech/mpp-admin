import InputComponent from "@/components/InputComponent";
import { dataServiceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { DataServices } from "@/types/type";

async function getData(): Promise<DataServices[]> {
  return [
    {
      id: 1,
      no: 2,
      instance: "Dinas PUPR",
      service: "Buat Jalan",
    },
    // ...
  ];
}

const MasterService = async () => {
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
          header="Tambah Layanan"
          content={
            <>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="font-normal text-xl text-neutral-900">
                    Nama Instansi
                  </p>
                  <InputComponent />
                </div>
                <div className="space-y-2">
                  <p className="font-normal text-xl text-neutral-900">
                    Nama Layanan
                  </p>
                  <InputComponent />
                </div>
              </div>
            </>
          }
        />
      </div>
      <DataTables columns={dataServiceColumns} data={data} />
    </section>
  );
};

export default MasterService;
