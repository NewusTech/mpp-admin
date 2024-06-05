"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  jenis: string;
  online: boolean;
  offline: boolean;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "jenis",
    header: "Jenis Layanan",
  },
  {
    accessorKey: "online",
    header: "Online",
  },
  {
    accessorKey: "offline",
    header: "Offline",
  },
];
