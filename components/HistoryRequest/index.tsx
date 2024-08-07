import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabOffline from "@/components/HistoryRequest/TabOffline";
import TabOnline from "@/components/HistoryRequest/TabOnline";

interface HistoryRequestProps {
  serviceId: number | null;
  instanceId: number | null;
  role: string | null;
}

export default function HistoryRequest({
  serviceId,
  instanceId,
  role,
}: HistoryRequestProps) {
  return (
    <Tabs defaultValue="offline" className="my-8">
      <TabsList className="p-0 bg-transparent rounded-none w-full justify-between mb-4">
        <TabsTrigger
          value="offline"
          className="text-[26px] pb-3 text-primary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
        >
          Offline
        </TabsTrigger>
        <TabsTrigger
          value="online"
          className="text-[26px] pb-3 text-secondary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-secondary-700 data-[state=active]:shadow-none"
        >
          Online
        </TabsTrigger>
      </TabsList>
      <TabsContent value="offline">
        <TabOffline serviceId={serviceId} instanceId={instanceId} role={role} />
      </TabsContent>
      <TabsContent value="online">
        <TabOnline serviceId={serviceId} instanceId={instanceId} role={role} />
      </TabsContent>
    </Tabs>
  );
}
