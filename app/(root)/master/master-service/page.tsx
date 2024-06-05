import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { columns, Payment } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";

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
      <DataTables columns={columns} data={data} />
    </section>
  );
};

export default MasterInsantce;
