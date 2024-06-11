import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { columns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { Payment } from "@/types/type";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      jenis: "Layanan Aldi",
      online: true,
      offline: false,
    },
    // ...
  ];
}

const MasterFacility = async () => {
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
          header="Tambah Fasilitas"
          content={
            <>
              <div className="p-6 space-y-2">
                <p className="font-normal">Pilih Gambar</p>
                <InputComponent typeInput="file" />
              </div>
            </>
          }
        />
      </div>
      <DataTables columns={columns} data={data} />
    </section>
  );
};

export default MasterFacility;
