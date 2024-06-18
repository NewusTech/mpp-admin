"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { manageRequirementColumns } from "@/constants";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import useCreateRequirement from "@/lib/store/useCreateRequirement";

const ManageRequirements = () => {
  const [instance, setInstance] = useState<string>("");
  const setSelectedId = useCreateRequirement((state) => state.setSelectedId);

  const handlePassIdInstnace = (id: number) => {
    setSelectedId(id);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  const { data: services } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${instanceId}`,
    fetcher,
  );

  const result = data?.data;
  const serviceAll = services?.data;

  return (
    <section className="mr-16">
      <div>
        <h1 className="text-lg font-semibold">Kelola Persyaratan</h1>
        <div className="flex justify-between mt-4">
          <div className="w-1/2">
            <Select value={instance} onValueChange={(e: any) => setInstance(e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Instansi" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Instansi</SelectLabel>
                  {result?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {instance ? (
            <Link href="/manage-requirement/create">
              <Button
                onClick={() => handlePassIdInstnace(instanceId)}
                className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
              >
                Tambah
              </Button>
            </Link>
          ) : (
            <Button
              disabled={true}
              className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
            >
              Tambah
            </Button>
          )}
        </div>
        {serviceAll && (
          <DataTables
            columns={manageRequirementColumns}
            data={serviceAll}
            filterBy="name"
            type="requirement"
          />
        )}
      </div>
    </section>
  );
};

export default ManageRequirements;
