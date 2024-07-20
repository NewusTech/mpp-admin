import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabRevision from "@/components/ManageRevision/TabRevision";
import TabFixed from "@/components/ManageRevision/TabFixed";

interface ManageRevisionProps {
  serviceId: number | null;
  instanceId: number | null;
}

export default function ManageRevision({
  serviceId,
  instanceId,
}: ManageRevisionProps) {
  return (
    <Tabs defaultValue="revision" className="my-8">
      <TabsList className="p-0 bg-transparent rounded-none w-full justify-between mb-4">
        <TabsTrigger
          value="revision"
          className="text-[26px] pb-3 text-primary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
        >
          Perbaikan
        </TabsTrigger>
        <TabsTrigger
          value="fixed"
          className="text-[26px] pb-3 text-secondary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-secondary-700 data-[state=active]:shadow-none"
        >
          Diperbaiki
        </TabsTrigger>
      </TabsList>
      <TabsContent value="revision" className="mt-8">
        <TabRevision serviceId={serviceId} instanceId={instanceId} />
      </TabsContent>
      <TabsContent value="fixed">
        <TabFixed serviceId={serviceId} instanceId={instanceId} />
      </TabsContent>
    </Tabs>
  );
}
