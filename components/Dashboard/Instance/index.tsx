import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import TabQueue from "@/components/Dashboard/Instance/TabQueue";
import TabService from "@/components/Dashboard/Instance/TabService";

const InstanceDashboard = () => {
  return (
    <>
      <div className="flex items-center justify-end">
        <div className="flex gap-x-6 items-center">
          <div className="flex items-center space-x-2">
            <Label htmlFor="airplane-mode" className="text-secondary-700">
              Offline
            </Label>
            <Switch
              id="airplane-mode"
              className="data-[state=checked]:bg-secondary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-secondary-700"
              thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-secondary-700 data-[state=unchecked]:ml-[2px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="airplane-mode" className="text-primary-700">
              Online
            </Label>
            <Switch
              id="airplane-mode"
              className="data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-primary-700"
              thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-primary-700 data-[state=unchecked]:ml-[2px]"
            />
          </div>
        </div>
      </div>
      <div className="mt-14 rounded-[16px] bg-primary-200 p-8 flex gap-x-[73px] items-center">
        <div className="w-[60px] h-[80px]">
          <Image
            src="/images/logo1.png"
            alt="Logo"
            className="w-full h-full object-contain"
            width={60}
            height={80}
          />
        </div>
        <h1 className="text-[26px] font-semibold text-primary-800">
          Dinas Kependudukan dan Catatan Sipil
        </h1>
      </div>
      <Tabs defaultValue="queue" className="my-8">
        <TabsList className="p-0 bg-transparent rounded-none w-full justify-between">
          <TabsTrigger
            value="queue"
            className="text-[26px] pb-3 text-secondary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-secondary-700 data-[state=active]:shadow-none"
          >
            Antrian
          </TabsTrigger>
          <TabsTrigger
            value="service"
            className="text-[26px] pb-3 text-primary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
          >
            Layanan
          </TabsTrigger>
          <TabsTrigger
            value="survey"
            className="text-[26px] pb-3 text-primary-800 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-800 data-[state=active]:shadow-none"
          >
            Survey
          </TabsTrigger>
        </TabsList>
        <TabsContent value="queue" className="mt-8">
          <TabQueue />
        </TabsContent>
        <TabsContent value="service">
          <TabService />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default InstanceDashboard;
