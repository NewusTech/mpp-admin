"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabRevision from "@/components/ManageRevision/TabRevision";
import TabFixed from "@/components/ManageRevision/TabFixed";
import useRevisionStore from "@/lib/store/useRevisionStore";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

interface ManageRevisionProps {
  serviceId: number | null;
  instanceId: number | null;
  role: string | null;
}

export default function ManageRevision({
  serviceId,
  instanceId,
  role,
}: ManageRevisionProps) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  const { data: revision } = useSWR<any>(
    `${baseUrl}?instansi_id=${instanceId}&layanan_id=${serviceId}&limit=10000000&status=5`,
    fetcher,
  );
  const { data: fixed } = useSWR<any>(
    `${baseUrl}?instansi_id=${instanceId}&layanan_id=${serviceId}&limit=10000000&status=6`,
    fetcher,
  );

  const countRevision = revision?.pagination?.totalCount;
  const countFixed = fixed?.pagination?.totalCount;

  return (
    <Tabs defaultValue="revision" className="my-8">
      <TabsList className="p-0 bg-transparent rounded-none w-full justify-between mb-4">
        <TabsTrigger
          value="revision"
          className="text-[26px] pb-3 text-primary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
        >
          <div className="flex space-x-1">
            <p>Butuh Perbaikan</p>
            {countRevision !== 0 && (
              <div className="rounded-full w-4 h-4 bg-error-700 items-center justify-center">
                <p className="text-neutral-50 text-xs">{countRevision}</p>
              </div>
            )}
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="fixed"
          className="text-[26px] pb-3 text-secondary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-secondary-700 data-[state=active]:shadow-none"
        >
          <div className="flex space-x-1">
            <p>Sudah Diperbaiki</p>
            {countFixed !== 0 && (
              <div className="rounded-full w-4 h-4 bg-error-700 items-center justify-center">
                <p className="text-neutral-50 text-xs">{countFixed}</p>
              </div>
            )}
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="revision" className="mt-8">
        <TabRevision
          serviceId={serviceId}
          instanceId={instanceId}
          role={role}
        />
      </TabsContent>
      <TabsContent value="fixed" className="mt-8">
        <TabFixed serviceId={serviceId} instanceId={instanceId} role={role} />
      </TabsContent>
    </Tabs>
  );
}
