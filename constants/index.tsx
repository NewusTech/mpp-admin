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
  Complaint,
  Contact,
  DataApps,
  DataInstance,
  DataServices,
  DetailSurveyResult,
  Facility,
  FAQ,
  FlowBooking,
  GuestBook,
  HistoryQueue,
  ManageAdmin,
  ManageApprovals,
  ManageRequirements,
  ManageUser,
  ManualBook,
  News,
  QueueTab,
  Report,
  RequestOffline,
  RequestOnline,
  Slider,
  SurveyQuestion,
  SurveyResult,
  TermAndCondition,
  Video,
  VisionMission,
} from "@/types/type";
import Link from "next/link";
import AlertDialogUpdateFaq from "@/app/(root)/master/master-faq/DialogFormUpdate";
import Image from "next/image";
import AlertDialogUpdateFacility from "@/app/(root)/master/master-facility/DialogFormUpdate";
import AlertDialogUpdateCarousel from "@/app/(root)/master/carousel/DialogFormUpdate";
import ModalDelete from "@/components/Dialog/delete";
import AlertDialogUpdateSurvey from "@/app/(root)/survey/question/DialogFormUpdate";
import SwitchActive from "@/components/SwitchActive";
import AlertDialogUpdateMasterFlowBooking from "@/app/(root)/master/flow-booking/DialogFormUpdate";
import AlertDialogUpdateMasterFlowPermohonan from "@/app/(root)/master/flow-request/DialogFormUpdate";
import AlertDialogCreateMasterFlow from "@/app/(root)/master/flow-mpp/DialogForm";
import { RichTextDisplay } from "@/components/RichTextDisplay";
import ModalPermission from "@/components/Dialog/permission";
import ChangePasswordDialog from "@/components/Dialog/change-password";
import AlertDialogCreateMasterManualBook from "@/app/(root)/master/manual-book/DialogForm";

function formatDate(dateString: any) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const StatusCell = ({
  status,
  id,
  link,
}: {
  link: string;
  status: number;
  id: number;
}) => {
  const getStatusElement = () => {
    switch (status) {
      case 0:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-secondary-700 hover:bg-secondary-800 rounded-full w-full text-[10px] p-1 text-center"
          >
            <p className="text-neutral-50">Menunggu</p>
          </Link>
        );
      case 1:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-primary-700 hover:bg-primary-800 rounded-full w-full text-[10px] p-1 text-center"
          >
            <p className="text-neutral-50">Divalidasi</p>
          </Link>
        );
      case 2:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-primary-800 hover:bg-primary-700 rounded-full w-full text-[10px] p-1 text-center"
          >
            <p className="text-neutral-50">Disetujui</p>
          </Link>
        );
      case 3:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-success-700 hover:bg-success-800 rounded-full w-full text-[10px] p-1 text-center"
          >
            <p className="text-neutral-50">Selesai</p>
          </Link>
        );
      case 4:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-error-700 hover:bg-error-800 rounded-full w-full text-[10px] p-1 text-center"
          >
            <p className="text-neutral-50">Ditolak</p>
          </Link>
        );
      case 5:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-warning-700 hover:bg-warning-800 rounded-full w-full text-[10px] p-1 text-center"
          >
            <p className="text-neutral-50">Perbaikan</p>
          </Link>
        );
      default:
        return (
          <Link
            href={`${link}/${id}`}
            className="bg-neutral-800 hover:bg-neutral-900 rounded-full w-full text-[10px] text-neutral-50 p-1 text-center"
          >
            <p>Diperbaiki</p>
          </Link>
        );
    }
  };

  return getStatusElement();
};

const StatusQueue = ({ status }: { status: boolean }) => {
  const getStatusElement = () => {
    switch (status) {
      case false:
        return (
          <div className="bg-secondary-700 rounded-full w-8/12 text-[10px] p-1 text-center">
            <p className="text-neutral-50">Menunggu</p>
          </div>
        );
      default:
        return (
          <div className="bg-success-700 rounded-full w-8/12 text-[10px] p-1 text-center">
            <p className="text-neutral-50">Selesai</p>
          </div>
        );
    }
  };

  return getStatusElement();
};

const getDayName = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
};

const getTime = (isoString: string) => {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} WIB`;
};

export const queueColumns: ColumnDef<QueueTab>[] = [
  {
    accessorKey: "name",
    header: "Jenis Layanan",
  },
  {
    accessorKey: "active_online",
    header: "Online",
    cell: ({ row }) => {
      const online = row.original.active_online;
      const id = row.original.id;
      return <SwitchActive id={id} status={online} type="active_online" />;
    },
  },
  {
    accessorKey: "active_offline",
    header: "Offline",
    cell: ({ row }) => {
      const offline = row.original.active_offline;
      const id = row.original.id;
      return <SwitchActive id={id} status={offline} type="active_offline" />;
    },
  },
];

export const requestOnlineColumns: ColumnDef<RequestOnline>[] = [
  {
    id: "tanggal",
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    id: "hari",
    accessorKey: "createdAt",
    header: "Hari",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getDayName(date)}</p>;
    },
  },
  {
    id: "jam",
    accessorKey: "createdAt",
    header: "Jam",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getTime(date)}</p>;
    },
  },
  {
    accessorKey: "nik",
    header: "NIK",
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
  { accessorKey: "layanan_name", header: "Layanan" },
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
      const status = statusRow.status;

      return (
        <div className="flex justify-center">
          <StatusCell
            status={Number(status)}
            link="/request/online"
            id={statusRow.id}
          />
        </div>
      );
    },
  },
];

export const revisionColumns: ColumnDef<RequestOnline>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "nik",
    header: "NIK",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "layanan_name",
    header: "Layanan",
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
      const status = statusRow.status;

      return (
        <div className="flex justify-center">
          <StatusCell
            status={Number(status)}
            link="/request/revision"
            id={statusRow.id}
          />
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
            <Link href={`/request/revision/${action.id}`}>
              <Button
                size="xs"
                className="text-xs w-full rounded-full py-1 bg-neutral-700 text-neutral-50 hover:bg-neutral-800"
              >
                Detail
              </Button>
            </Link>
          </div>
        </>
      );
    },
  },
];

export const requestOfflineColumns: ColumnDef<RequestOffline>[] = [
  {
    id: "tanggal",
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    id: "hari",
    accessorKey: "createdAt",
    header: "Hari",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getDayName(date)}</p>;
    },
  },
  {
    id: "jam",
    accessorKey: "createdAt",
    header: "Jam",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getTime(date)}</p>;
    },
  },
  {
    accessorKey: "nik",
    header: "NIK",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <Link href={`/history-approvals/${record.id}`} className="underline">
          {record.nik}
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "layanan_name",
    header: "Layanan",
  },
];

export const manageApprovalColumns: ColumnDef<ManageApprovals>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "nik",
    header: "NIK",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "layanan_name",
    header: "Layanan",
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
      const status = statusRow.status;

      return (
        <div className="flex justify-center">
          <StatusCell
            status={Number(status)}
            link="/manage-approvals"
            id={statusRow.id}
          />
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
                size="xs"
                className="text-xs w-full rounded-full py-1 bg-neutral-700 text-neutral-50 hover:bg-neutral-800"
              >
                Detail
              </Button>
            </Link>
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
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },

  {
    accessorKey: "nik",
    header: "NIK",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "layanan_name",
    header: "Layanan",
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
      const status = statusRow.status;

      return (
        <div className="flex justify-center">
          <StatusCell
            status={Number(status)}
            link="/history-approvals"
            id={statusRow.id}
          />
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
      const status = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-x-3">
            <Link href={`/history-approvals/${status.id}`}>
              <Button
                size="xs"
                className="text-xs rounded-full w-full py-1 bg-neutral-700 text-neutral-50 hover:bg-neutral-800"
              >
                Detail
              </Button>
            </Link>
          </div>
        </>
      );
    },
  },
];

export const reportTabColumns: ColumnDef<ManageApprovals>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },

  {
    accessorKey: "nik",
    header: "NIK",
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const status = row.original;

      return (
        <>
          <div className="flex gap-x-3">
            <Link href={`/history-approvals/${status.id}`}>
              <p>{status.name}</p>
            </Link>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "layanan_name",
    header: "Layanan",
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
      const status = statusRow.status;

      return (
        <div className="flex justify-center">
          <StatusCell
            status={Number(status)}
            link="/history-approvals"
            id={statusRow.id}
          />
        </div>
      );
    },
  },
];

export const dashboardApprovalColumns: ColumnDef<ManageApprovals>[] = [
  {
    id: "tanggal",
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    id: "hari",
    accessorKey: "createdAt",
    header: "Hari",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getDayName(date)}</p>;
    },
  },
  {
    id: "jam",
    accessorKey: "createdAt",
    header: "Jam",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getTime(date)}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const name = row.original;
      return (
        <Link href={`/history-approvals/${name.id}`} className="underline">
          {name.name}
        </Link>
      );
    },
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
      const status = statusRow.status;

      return (
        <div className="flex justify-center">
          <StatusCell
            status={Number(status)}
            link="/history-approvals"
            id={statusRow.id}
          />
        </div>
      );
    },
  },
];

export const dataAppsColumns: ColumnDef<DataApps>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "image",
    header: "Logo",
    cell: ({ row }) => {
      const apps = row.original;

      return (
        <div>
          <Image src={apps.image} alt={apps.name} width={100} height={100} />
        </div>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const apps = row.original;
      return (
        <div>
          <a
            href={apps.link}
            className="underline hover:text-primary-700"
            target="_blank"
          >
            {apps.name}
          </a>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const instance = row.original;

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
            <Link href={`/master/master-apps/${instance.slug}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <ModalDelete endpoint={`aplikasietc/delete/${instance.slug}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const dataInstanceColumns: ColumnDef<DataInstance>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Instansi",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const instance = row.original;

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
            <Link href={`/master/master-instance/${instance.slug}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>
            <ModalDelete endpoint={`instansi/delete/${instance.slug}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const dataServiceColumns: ColumnDef<DataServices>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
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
            <Link href={`/master/master-service/${service.id}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <ModalDelete endpoint={`layanan/delete/${service.id}`} />
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
      const requirement = row.original;

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
            <Link href={`/manage-requirement/${requirement.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>
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
    accessorKey: "desc",
    header: "Deskripsi",
    cell: ({ row }) => {
      const visi = row.original.desc;
      return <RichTextDisplay content={visi} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const survey = row.original;

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
            <AlertDialogUpdateSurvey id={survey.id} />
            <ModalDelete endpoint={`surveyform/delete/${survey.id}`} />
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
    cell: ({ row }) => {
      const value = row.original.Surveyformnums_nilai;
      return <p>{value !== 0 ? value.toFixed(2) : 0}</p>;
    },
  },
];

export const detailSurveyResultColumns: ColumnDef<DetailSurveyResult>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.date;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "pendidikan",
    header: "Pendidikan",
    cell: ({ row }) => {
      const education2 = row.original.pendidikan;
      const education =
        educations.find((item: any) => item.id === education2)?.key ||
        "Tidak Diketahui";
      return <p>{education}</p>;
    },
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const gender2 = row.original.gender;
      const gender =
        genders.find((item: any) => item.id === gender2)?.key ||
        "Tidak Diketahui";
      return <p>{gender}</p>;
    },
  },
  { accessorKey: "kritiksaran", header: "Kritik dan Saran" },
  {
    accessorKey: "nilai",
    header: "Nilai",
  },
];

export const newsColumns: ColumnDef<News>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original;

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
            <Link href={`/articles/${article.slug}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>
            <ModalDelete endpoint={`artikel/delete/${article.slug}`} />
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
    id: "hari",
    accessorKey: "createdAt",
    header: "Hari",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getDayName(date)}</p>;
    },
  },
  {
    id: "jam",
    accessorKey: "createdAt",
    header: "Jam",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getTime(date)}</p>;
    },
  },
  {
    id: "date",
    accessorKey: "createdAt",
    header: "Tanggal Gabung",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
            <Link href={`/manage-user/society/${user.slug}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <ChangePasswordDialog slug={user.slug} />
            <ModalDelete endpoint={`alluserinfo/delete/${user.slug}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const manageAdminColumns: ColumnDef<ManageAdmin>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    id: "hari",
    accessorKey: "createdAt",
    header: "Hari",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getDayName(date)}</p>;
    },
  },
  {
    id: "jam",
    accessorKey: "createdAt",
    header: "Jam",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{getTime(date)}</p>;
    },
  },
  {
    id: "date",
    accessorKey: "createdAt",
    header: "Tanggal Didaftarkan",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  {
    accessorKey: "Instansi",
    header: "Instansi",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <p>
          {user.Instansi === null && user.Role === "Bupati"
            ? "Kepala Daerah"
            : user.Instansi === null
              ? "Masyarakat"
              : user.Instansi}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
            <Link
              href={`/manage-user/admin/${user.slug}`}
              className="hover:bg-slate-400"
            >
              <DropdownMenuItem className="cursor-pointer w-full">
                Edit
              </DropdownMenuItem>
            </Link>
            <ChangePasswordDialog slug={user.slug} />
            <ModalDelete endpoint={`alluserinfo/delete/${user.slug}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const managePermissionColumns: ColumnDef<ManageAdmin>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  {
    accessorKey: "Instansi",
    header: "Instansi",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <p>
          {user.Instansi === null && user.Role === "Bupati"
            ? "Kepala Daerah"
            : user.Instansi === null
              ? "Masyarakat"
              : user.Instansi}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <ModalPermission id={user?.id} />;
    },
  },
];

export const reportColumns: ColumnDef<Report>[] = [
  {
    accessorKey: "name",
    header: "Jenis Layanan",
    cell: ({ row }) => {
      const field = row.original;
      return (
        <Link href={`/report/${field.id}`} className="underline">
          <p>{field.name}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "menunggu",
    header: "Menunggu",
  },
  {
    accessorKey: "gagal",
    header: "Gagal",
  },
  {
    accessorKey: "selesai",
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
            <ModalDelete endpoint={`faq/delete/${faq.id}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const facilitiesColumns: ColumnDef<Facility>[] = [
  {
    accessorKey: "title",
    header: "Judul",
  },
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
            <AlertDialogUpdateFacility slug={facility.slug} />
            <ModalDelete endpoint={`facilities/delete/${facility.slug}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const carouselColumns: ColumnDef<Facility>[] = [
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const carousel = row.original;
      return (
        <div>
          <Image src={carousel.image} alt="image" width={100} height={100} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const carousel = row.original;

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
            <AlertDialogUpdateCarousel id={carousel.id} />
            <ModalDelete endpoint={`carousel/delete/${carousel.id}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const flowColumns: ColumnDef<Slider>[] = [
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const flow = row.original;
      return (
        <div>
          <Image src={flow.image} alt="image" width={200} height={200} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const flow = row.original;

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
            <AlertDialogCreateMasterFlow id={flow.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const flowBookingColumns: ColumnDef<FlowBooking>[] = [
  {
    accessorKey: "desc",
    header: "Deskripsi",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const flow = row.original;

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
            <AlertDialogUpdateMasterFlowBooking id={flow.id} />
            <ModalDelete endpoint={`alurbooking/delete/${flow.id}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const flowRequestColumns: ColumnDef<FlowBooking>[] = [
  {
    accessorKey: "desc",
    header: "Deskripsi",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const flow = row.original;

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
            <AlertDialogUpdateMasterFlowPermohonan id={flow.id} />
            <ModalDelete endpoint={`alurpermohonan/delete/${flow.id}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const manualBookColumns: ColumnDef<ManualBook>[] = [
  {
    accessorKey: "dokumen",
    header: "Dokumen",
    cell: ({ row }) => {
      const documents = row.original;
      return (
        <Link href={documents?.dokumen} target="_blank" className="underline">
          Manual Book {documents?.role_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "video",
    header: "Video",
    cell: ({ row }) => {
      const flow = row.original;
      return (
        <div>
          <video
            src={flow.video}
            controls={true}
            muted={true}
            className="w-1/2 h-20"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
            <AlertDialogCreateMasterManualBook id={user?.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const videoColumns: ColumnDef<Video>[] = [
  {
    accessorKey: "video",
    header: "Video",
    cell: ({ row }) => {
      const flow = row.original;
      return (
        <div>
          <video
            src={flow.video}
            controls={true}
            muted={true}
            className="w-full h-auto"
          />
        </div>
      );
    },
  },
];

export const contactColumns: ColumnDef<Contact>[] = [
  {
    accessorKey: "alamat",
    header: "Alamat",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "latitude",
    header: "Garis Lintang",
  },
  {
    accessorKey: "longitude",
    header: "Garis Bujur",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
  {
    accessorKey: "desc",
    header: "Deskripsi",
  },
  {
    accessorKey: "telp",
    header: "Telepon",
  },
];

export const dashboardSuperadminColumns: ColumnDef<any>[] = [
  {
    accessorKey: "layanan_createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.layanan_createdAt;

      function formatDate(dateString: any) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "instansi_name",
    header: "Nama Instansi",
  },
  {
    accessorKey: "layanan_name",
    header: "Nama Layanan",
  },
  // {
  //   accessorKey: "antrian",
  //   header: "Antrian",
  // },
  {
    accessorKey: "permohonanCount",
    header: "Permohonan",
  },
  {
    accessorKey: "skmCount",
    header: "SKM",
  },
];

export const VisionMissionColumns: ColumnDef<VisionMission>[] = [
  {
    accessorKey: "visi",
    header: "Visi",
    cell: ({ row }) => {
      const visi = row.original.visi;
      return <RichTextDisplay content={visi} />;
    },
  },
  {
    accessorKey: "misi",
    header: "Misi",
    cell: ({ row }) => {
      const misi = row.original.misi;
      return <RichTextDisplay content={misi} />;
    },
  },
];

export const termAndConditionColumns: ColumnDef<TermAndCondition>[] = [
  {
    accessorKey: "desc",
    header: "Dokumen",
    cell: ({ row }) => {
      const desc = row.original.desc;
      return (
        <Link href={desc} target="_blank" className="underline">
          Dokumen
        </Link>
      );
    },
  },
  {
    accessorKey: "privasi_text",
    header: "Syarat & Ketentuan",
    cell: ({ row }) => {
      const desc = row.original.privasi_text;
      return <RichTextDisplay content={desc} />;
    },
  },
];

export const complaintColumns: ColumnDef<Complaint>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    accessorKey: "Instansi.name",
    header: "Nama",
  },
  {
    accessorKey: "Layanan.name",
    header: "Jenis Layanan",
  },
  {
    accessorKey: "judul",
    header: "Judul Pengaduan",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const complaint = row.original;

      return (
        <div className="flex gap-x-2">
          <Link href={`/complaint/${complaint.id}`}>
            <Button
              size="xs"
              className="text-xs rounded-full bg-secondary-700 hover:bg-secondary-800"
            >
              Balas
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const guestBookColumns: ColumnDef<GuestBook>[] = [
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      return <p>{formatDate(row.original.createdAt)}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const name = row.original;
      return (
        <Link href={`/guest-book/${name.id}`} className="underline">
          {name.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "pekerjaan",
    header: "Pekerjaan",
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
  },
  {
    accessorKey: "tujuan",
    header: "Tujuan",
  },
];

export const activeQueueColumns: ColumnDef<HistoryQueue>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "code",
    header: "Nomor Antrian",
  },
  {
    accessorKey: "createdAt",
    header: "Waktu Datang",
    cell: ({ row }) => {
      const time = row.original.createdAt;
      return <p>{getTime(time)}</p>;
    },
  },
  {
    accessorKey: "finishedAt",
    header: "Waktu Selesai",
    cell: ({ row }) => {
      const time = row.original.finishedAt;
      return <p>{getTime(time)}</p>;
    },
  },
  {
    accessorKey: "timeprocess",
    header: "Waktu Proses",
    cell: ({ row }) => {
      const time = row.original;
      return <p>{time.timeprocess || "-"}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="flex">
          <StatusQueue status={status} />
        </div>
      );
    },
  },
];

export const historyQueueColumns: ColumnDef<HistoryQueue>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "code",
    header: "Nomor Antrian",
  },
  {
    accessorKey: "createdAt",
    header: "Waktu Datang",
    cell: ({ row }) => {
      const time = row.original.createdAt;
      return <p>{getTime(time)}</p>;
    },
  },
  {
    accessorKey: "finishedAt",
    header: "Waktu Selesai",
    cell: ({ row }) => {
      const time = row.original.finishedAt;
      return <p>{getTime(time)}</p>;
    },
  },
  {
    accessorKey: "timeprocess",
    header: "Waktu Proses",
    cell: ({ row }) => {
      const time = row.original;
      return <p>{time.timeprocess || "-"}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="flex">
          <StatusQueue status={status} />
        </div>
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
    value: "textarea",
    name: "Jawaban Panjang",
  },
  {
    id: 3,
    value: "number",
    name: "Jawaban Angka",
  },
  {
    id: 4,
    value: "radio",
    name: "Satu Pilihan",
  },
  {
    id: 5,
    value: "checkbox",
    name: "Banyak Pilihan",
  },
  {
    id: 6,
    value: "date",
    name: "Tanggal",
  },
];

export const religions = [
  { id: 1, key: "Islam" },
  { id: 2, key: "Kristen" },
  { id: 3, key: "Katolik" },
  { id: 4, key: "Hindu" },
  { id: 5, key: "Buddha" },
  { id: 6, key: "Konghucu" },
];

export const educations = [
  { id: 1, key: "Tidak Sekolah" },
  { id: 2, key: "SD" },
  { id: 3, key: "SMP" },
  { id: 4, key: "SMA" },
  { id: 5, key: "D1" },
  { id: 6, key: "D2" },
  { id: 7, key: "D3" },
  { id: 8, key: "S1" },
  { id: 9, key: "S2" },
  { id: 10, key: "S3" },
];

export const marriedStatus = [
  { id: 1, key: "Belum Kawin" },
  { id: 2, key: "Kawin" },
  { id: 3, key: "Cerai Hidup" },
  { id: 4, key: "Cerai Mati" },
];

export const bloodTypes = [
  { id: 1, key: "A" },
  { id: 2, key: "B" },
  { id: 3, key: "AB" },
  { id: 4, key: "O" },
];

export const genders = [
  { id: 1, key: "Laki-Laki" },
  { id: 2, key: "Perempuan" },
];

export const roles = [
  { id: 1, key: "Bupati" },
  { id: 2, key: "Super Admin" },
  { id: 3, key: "Admin Instansi" },
  { id: 4, key: "Admin Verifikasi" },
  { id: 6, key: "Admin Layanan" },
];
