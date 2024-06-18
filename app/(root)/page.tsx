// import InputComponent from "@/components/InputComponent";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import CardDashboardQueue from "@/components/Dashboard/CardDashboardQueue";
// import ChartDashboard from "@/components/Dashboard/ChartDashboard";
//
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { columns } from "@/constants";
// import { DataTables } from "@/components/Datatables";
// import { Payment } from "@/types/type";

// async function getData(): Promise<Payment[]> {
//   return [
//     {
//       id: "728ed52f",
//       jenis: "Layanan Aldi",
//       online: true,
//       offline: false,
//     },
//     // ...
//   ];
// }

export default function Home() {
  // const data = await getData();

  return (
    <section className="mr-16">
      <p>Hello</p>
      {/*<div className="flex items-center justify-between">*/}
      {/*  <div className="w-1/2">*/}
      {/*    <InputComponent typeInput="select" />*/}
      {/*  </div>*/}
      {/*  <div className="flex gap-x-6 items-center">*/}
      {/*    <div className="flex items-center space-x-2">*/}
      {/*      <Label htmlFor="airplane-mode" className="text-secondary-700">*/}
      {/*        Offline*/}
      {/*      </Label>*/}
      {/*      <Switch*/}
      {/*        id="airplane-mode"*/}
      {/*        className="data-[state=checked]:bg-secondary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-secondary-700"*/}
      {/*        thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-secondary-700 data-[state=unchecked]:ml-[2px]"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="flex items-center space-x-2">*/}
      {/*      <Label htmlFor="airplane-mode" className="text-primary-700">*/}
      {/*        Online*/}
      {/*      </Label>*/}
      {/*      <Switch*/}
      {/*        id="airplane-mode"*/}
      {/*        className="data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-primary-700"*/}
      {/*        thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-primary-700 data-[state=unchecked]:ml-[2px]"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="grid grid-cols-3 gap-x-5 mt-[54px]">*/}
      {/*  <CardDashboardQueue*/}
      {/*    title="Total Antrian Hari Ini"*/}
      {/*    number={20}*/}
      {/*    background="bg-secondary-700"*/}
      {/*  />*/}
      {/*  <CardDashboardQueue*/}
      {/*    title="Antrian Ke -"*/}
      {/*    number={10}*/}
      {/*    background="bg-primary-800"*/}
      {/*  />*/}
      {/*  <CardDashboardQueue*/}
      {/*    title="Permohonan Online Hari Ini"*/}
      {/*    number={20}*/}
      {/*    background="bg-primary-700"*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<div className="flex gap-x-2 mt-4">*/}
      {/*  <div className="w-8/12 rounded-[20px] p-6 shadow">*/}
      {/*    <div className="flex items-center gap-x-6">*/}
      {/*      <h4 className="text-[16px] text-neutral-900 font-semibold">*/}
      {/*        Statistik*/}
      {/*      </h4>*/}
      {/*      <p className="text-[10px] text-neutral-800 font-semibold">2024</p>*/}
      {/*    </div>*/}
      {/*    <div className="flex gap-x-5 mt-5">*/}
      {/*      <div className="flex gap-x-2 items-center justify-center">*/}
      {/*        <div className="w-2 h-2 bg-secondary-700 rounded-full"></div>*/}
      {/*        <p className="text-xs font-medium text-neutral-800">*/}
      {/*          Booking Antrian*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*      <div className="flex gap-x-2 items-center justify-center">*/}
      {/*        <div className="w-2 h-2 bg-primary-700 rounded-full"></div>*/}
      {/*        <p className="text-xs font-medium text-neutral-800">*/}
      {/*          Permohonan Layanan Online*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <ChartDashboard />*/}
      {/*  </div>*/}
      {/*  <div className="w-4/12 rounded-[20px] shadow p-4">*/}
      {/*    <Select>*/}
      {/*      <SelectTrigger className="w-[180px] border-0 font-semibold">*/}
      {/*        <SelectValue placeholder="Select a fruit" />*/}
      {/*      </SelectTrigger>*/}
      {/*      <SelectContent>*/}
      {/*        <SelectGroup>*/}
      {/*          <SelectLabel>Fruits</SelectLabel>*/}
      {/*          <SelectItem value="apple">Apple</SelectItem>*/}
      {/*          <SelectItem value="banana">Banana</SelectItem>*/}
      {/*          <SelectItem value="blueberry">Blueberry</SelectItem>*/}
      {/*          <SelectItem value="grapes">Grapes</SelectItem>*/}
      {/*          <SelectItem value="pineapple">Pineapple</SelectItem>*/}
      {/*        </SelectGroup>*/}
      {/*      </SelectContent>*/}
      {/*    </Select>*/}
      {/*    <div className="h-[62px] w-full rounded-full px-7 py-2 bg-secondary-700 flex items-center justify-between mt-4">*/}
      {/*      <p className="font-semibold text-neutral-50 text-xs">*/}
      {/*        Total Permohonanan Online*/}
      {/*      </p>*/}
      {/*      <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">*/}
      {/*        <p className="text-secondary-700 font-semibold text-sm">80</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="h-[62px] w-full rounded-full px-7 py-2 bg-primary-700 flex items-center justify-between mt-4">*/}
      {/*      <p className="font-semibold text-neutral-50 text-xs">*/}
      {/*        Total Antrian Online*/}
      {/*      </p>*/}
      {/*      <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">*/}
      {/*        <p className="text-primary-700 font-semibold text-sm">80</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="h-[62px] w-full rounded-full px-7 py-2 bg-primary-800 flex items-center justify-between mt-4">*/}
      {/*      <p className="font-semibold text-neutral-50 text-xs">*/}
      {/*        Total Permohonanan Selesai*/}
      {/*      </p>*/}
      {/*      <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">*/}
      {/*        <p className="text-primary-800 font-semibold text-sm">80</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<DataTables columns={columns} data={data} filterBy="name" />*/}
    </section>
  );
}
