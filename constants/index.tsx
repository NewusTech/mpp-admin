"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataInstance,
  DataServices,
  DetailSurveyResult,
  ManageApprovals,
  ManageRequirements,
  ManageUser,
  News,
  Payment,
  Report,
  RequestOffline,
  RequestOnline,
  SurveyQuestion,
  SurveyResult,
} from "@/types/type";
import Link from "next/link";
import { toast } from "sonner";
import Cookies from "js-cookie";

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

export const requestOnlineColumns: ColumnDef<RequestOnline>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const requestOfflineColumns: ColumnDef<RequestOffline>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "nik",
    header: "NIK",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const manageApprovalColumns: ColumnDef<ManageApprovals>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "action",
    header: () => {
      return (
        <div className="flex justify-center">
          <p>Aksi</p>
        </div>
      );
    },
    cell: ({ row }) => {
      // const status = row.original.action;
      return (
        <>
          <div className="flex justify-center items-center gap-x-3">
            <Button
              size="sm"
              className="text-sm rounded-full py-1 bg-transparent border border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-neutral-50 "
            >
              Upload
            </Button>
            <Link href="/">
              <p className="underline text-[#3A28FF] text-sm">Unduh Template</p>
            </Link>
            <Button
              size="sm"
              className="text-sm rounded-full bg-success-700 hover:bg-success-800"
            >
              Setujui
            </Button>
          </div>
        </>
      );
    },
  },
];

export const historyApprovalColumns: ColumnDef<ManageApprovals>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "action",
    header: () => {
      return (
        <div className="flex justify-center">
          <p>Aksi</p>
        </div>
      );
    },
    cell: ({ row }) => {
      // const status = row.original.action;
      return (
        <>
          <div className="flex justify-center items-center gap-x-3">
            <Button
              size="sm"
              className="text-sm rounded-full bg-success-700 hover:bg-success-800"
            >
              Setujui
            </Button>
            <Button
              size="sm"
              className="text-sm rounded-full py-1 bg-secondary-700 hover:bg-secondary-800"
            >
              Lihat
            </Button>
          </div>
        </>
      );
    },
  },
];

export const dataInstanceColumns: ColumnDef<DataInstance>[] = [
  {
    accessorKey: "no",
    header: "no",
  },
  {
    accessorKey: "instance",
    header: "Instansi",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const dataServiceColumns: ColumnDef<DataServices>[] = [
  {
    accessorKey: "no",
    header: "no",
  },
  {
    accessorKey: "instance",
    header: "Instansi",
  },
  {
    accessorKey: "service",
    header: "Jenis Layanan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const manageRequirementColumns: ColumnDef<ManageRequirements>[] = [
  {
    accessorKey: "instance",
    header: "Instansi",
  },
  {
    accessorKey: "service",
    header: "Jenis Layanan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const surveyQuestionColumns: ColumnDef<SurveyQuestion>[] = [
  {
    accessorKey: "no",
    header: "No",
  },
  {
    accessorKey: "question",
    header: "Pertanyaan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const surveyResultColumns: ColumnDef<SurveyResult>[] = [
  {
    accessorKey: "service",
    header: "Jenis Layanan",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "value",
    header: "Jumlah Nilai",
  },
];

export const detailSurveyResultColumns: ColumnDef<DetailSurveyResult>[] = [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "value",
    header: "Nilai",
  },
];

export const newsColumns: ColumnDef<News>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
  },
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original;

      const handleDelete = async (slug: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/artikel/delete/${slug}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            },
          );
          const data = await response.json();
          toast(data.message);
        } catch (error: any) {
          toast(error.message);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href={`/articles/${article.slug}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleDelete(article.slug)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const manageUserColumns: ColumnDef<ManageUser>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const reportColumns: ColumnDef<Report>[] = [
  {
    accessorKey: "service",
    header: "Jenis Layanan",
  },
  {
    accessorKey: "waiting",
    header: "Menunggu",
  },
  {
    accessorKey: "failed",
    header: "Gagal",
  },
  {
    accessorKey: "success",
    header: "Selesai",
  },
];
