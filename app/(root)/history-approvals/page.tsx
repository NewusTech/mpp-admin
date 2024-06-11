import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { ManageApprovals } from "@/types/type";
import { historyApprovalColumns } from "@/constants";

async function getData(): Promise<ManageApprovals[]> {
  return [
    {
      id: 1,
      date: "08-19-2022",
      name: "Layanan Aldi",
      status: "Sudah disetujui",
    },
    // ...
  ];
}

const HistoryApprovals = async () => {
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
        <div className="flex w-4/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      <DataTables columns={historyApprovalColumns} data={data} />
    </section>
  );
};

export default HistoryApprovals;
