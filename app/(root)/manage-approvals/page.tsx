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

const ManageApprovals = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-full gap-x-5">
          <InputComponent typeInput="select" />
          <InputComponent typeInput="select" />
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="flex gap-x-3">
          <Button className="border bg-transparent border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-neutral-50 w-[140px] rounded-full">
            Online
          </Button>
          <Button className="border bg-transparent border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-neutral-50 w-[140px] rounded-full">
            Offline
          </Button>
        </div>
        <div className="flex w-3/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      <DataTables columns={columns} data={data} />
    </section>
  );
};

export default ManageApprovals;
