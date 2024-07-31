"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabOffline from "@/components/ManageApproval/TabOffline";
import TabOnline from "@/components/ManageApproval/TabOnline";
import { useEffect, useState } from "react";

interface ManageApprovalProps {
  serviceId: number | null;
  instanceId: number | null;
  queryParams: string | null;
  role: string | null;
}

export default function ManageApproval({
  serviceId,
  instanceId,
  queryParams,
  role,
}: ManageApprovalProps) {
  const [isTabs, setIsTabs] = useState<string>("online");

  useEffect(() => {
    if (queryParams == "online") {
      setIsTabs("online");
    } else if (queryParams == "offline") {
      setIsTabs("offline");
    }
  }, []);

  return (
    <Tabs
      value={isTabs ? isTabs : "offline"}
      onValueChange={(value) => setIsTabs(value)}
      className="my-8"
    >
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
      <TabsContent value="offline" className="mt-8">
        <TabOffline serviceId={serviceId} instanceId={instanceId} role={role} />
      </TabsContent>
      <TabsContent value="online" className="mt-8">
        <TabOnline serviceId={serviceId} instanceId={instanceId} role={role} />
      </TabsContent>
    </Tabs>
  );
}
