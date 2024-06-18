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
  Facility,
  FAQ,
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
import AlertDialogUpdateFaq from "@/app/(root)/master/master-faq/DialogFormUpdate";
import AlertDialogUpdateService from "@/app/(root)/master/master-service/DialogFormUpdate";
import Image from "next/image";
import AlertDialogUpdateFacility from "@/app/(root)/master/master-facility/DialogFormUpdate";
import AlertDialogUpdateInstance from "@/app/(root)/master/master-instance/DialogFormUpdate";
import { cn } from "@/lib/utils";

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
    cell: ({ row }) => {
      const online = row.original;
      return (
        <Link href={`/request/online/${online.id}`}>
          <p className="underline">{online.name}</p>
        </Link>
      );
    },
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
    header: () => {
      return (
        <div className="flex justify-center">
          <p>Status</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const statusRow = row.original;
      const status = statusRow.status.toString();

      return (
        <div
          className={cn("w-full h-full py-1 px-2 rounded-full text-center", {
            "bg-neutral-500 text-neutral-800": status === "0",
            "bg-primary-500 text-secondary-800": status === "2",
            "bg-primary-7A00 text-primary-800": status === "3",
            "bg-error-500 text-error-800": status === "4",
          })}
        >
          {status === "0" ? (
            <p>Menunggu</p>
          ) : status === "1" ? (
            <p>Sudah divalidasi</p>
          ) : status === "2" ? (
            <p>Sudah disetujui</p>
          ) : status === "3" ? (
            <p>Selesai</p>
          ) : (
            <p>Permohonan ditolak</p>
          )}
        </div>
      );
    },
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
      const action = row.original;
      return (
        <>
          <div className="flex justify-center items-center gap-x-3">
            <Link href={`/manage-approvals/${action.id}`}>
              <Button
                size="sm"
                className="text-sm rounded-full py-1 bg-transparent border border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-neutral-50 "
              >
                Upload
              </Button>
            </Link>
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
    accessorKey: "createdAt",
    header: "Tanggal",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex justify-center">
          <p>Status</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const statusRow = row.original;
      const status = statusRow.status.toString();

      return (
        <div
          className={cn("w-full h-full py-1 px-2 rounded-full text-center", {
            "bg-neutral-500 text-neutral-800": status === "0",
            "bg-primary-500 text-secondary-800": status === "2",
            "bg-primary-7A00 text-primary-800": status === "3",
            "bg-error-500 text-error-800": status === "4",
          })}
        >
          {status === "0" ? (
            <p>Menunggu</p>
          ) : status === "1" ? (
            <p>Sudah divalidasi</p>
          ) : status === "2" ? (
            <p>Sudah disetujui</p>
          ) : status === "3" ? (
            <p>Selesai</p>
          ) : (
            <p>Permohonan ditolak</p>
          )}
        </div>
      );
    },
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
    accessorKey: "id",
    header: "No",
  },
  {
    accessorKey: "name",
    header: "Instansi",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const instance = row.original;

      const handleDelete = async (slug: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/delete/${slug}`,
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
            <AlertDialogUpdateInstance slug={instance.slug} />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleDelete(instance.slug)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const dataServiceColumns: ColumnDef<DataServices>[] = [
  {
    accessorKey: "id",
    header: "No",
  },
  {
    accessorKey: "instansi_name",
    header: "Instansi",
  },
  {
    accessorKey: "name",
    header: "Jenis Layanan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;

      const handleDelete = async (id: number) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/delete/${id}`,
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
            <AlertDialogUpdateService id={service.id} />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleDelete(service.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const manageRequirementColumns: ColumnDef<ManageRequirements>[] = [
  {
    accessorKey: "instansi_name",
    header: "Instansi",
  },
  {
    accessorKey: "name",
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
    accessorKey: "id",
    header: "No",
  },
  {
    accessorKey: "field",
    header: "Pertanyaan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const survey = row.original;

      const handleDelete = async (id: number) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/surveyform/delete/${id}`,
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleDelete(survey.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const surveyResultColumns: ColumnDef<SurveyResult>[] = [
  {
    accessorKey: "layanan_name",
    header: "Jenis Layanan",
    cell: ({ row }) => {
      const survey = row.original;
      return (
        <Link href={`/survey/result/${survey.id}`}>
          <p className="underline">{survey.layanan_name}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "Surveyformnums_count",
    header: "Total",
  },
  {
    accessorKey: "Surveyformnums_nilai",
    header: "Jumlah Nilai",
  },
];

export const detailSurveyResultColumns: ColumnDef<DetailSurveyResult>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "nilai",
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

export const FAQColumns: ColumnDef<FAQ>[] = [
  {
    accessorKey: "question",
    header: "Pertanyaan",
  },
  {
    accessorKey: "answer",
    header: "Jawaban",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const faq = row.original;

      const handleDelete = async (id: number) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/faq/delete/${id}`,
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
            <AlertDialogUpdateFaq id={faq.id} />
            <DropdownMenuItem onClick={() => handleDelete(faq.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const facilitiesColumns: ColumnDef<Facility>[] = [
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const facility = row.original;
      return (
        <div>
          <Image src={facility.image} alt="image" width={100} height={100} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const facility = row.original;

      const handleDelete = async (id: number) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/facilities/delete/${id}`,
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
            <AlertDialogUpdateFacility id={facility.id} />
            <DropdownMenuItem onClick={() => handleDelete(facility.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const selectDataTypeForm = [
  {
    id: 1,
    value: "text",
    name: "Jawaban Singkat",
  },
  {
    id: 2,
    value: "number",
    name: "Jawaban Angka",
  },
  {
    id: 3,
    value: "radio",
    name: "Satu Pilihan",
  },
  {
    id: 4,
    value: "checkbox",
    name: "Banyak Pilihan",
  },
  {
    id: 5,
    value: "date",
    name: "Tanggal",
  },
];
