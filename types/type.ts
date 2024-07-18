export type QueueTab = {
  id: number;
  name: string;
  active_online: boolean;
  active_offline: boolean;
};

export type RequestOnline = {
  id: number;
  createdAt: string;
  name: string;
  status: string;
};

export type RequestOffline = {
  id: number;
  createdAt: string;
  name: string;
  nik: string;
  status: string;
};

export type ManageApprovals = {
  id: number;
  createdAt: string;
  name: string;
  status: string;
};

export type DataInstance = {
  id: number;
  no: number;
  name: string;
  slug: string;
};

export type DataApps = {
  id: number;
  link: string;
  name: string;
  slug: string;
  image: string;
};

export type DataServices = {
  id: number;
  no: number;
  name: string;
  instansi_name: string;
};

export type ManageRequirements = {
  id: number;
  instansi_name: string;
  layanan: string;
};

export type SurveyResult = {
  id: number;
  layanan_name: string;
  Surveyformnums_count: number;
  Surveyformnums_nilai: number;
};

export type SurveyQuestion = {
  id: number;
  no: number;
  field: string;
};

export type DetailSurveyResult = {
  id: number;
  date: string;
  name: string;
  kritiksaran: string;
  pendidikan: number;
  gender: number;
  nilai: string;
};

export type News = {
  id: number;
  slug: string;
  createdAt: string;
  title: string;
};

export type ManageUser = {
  id: number;
  name: string;
  slug: string;
  Role: string;
  Instansi: string;
};

export type Report = {
  id: number;
  name: string;
  menunggu: string;
  gagal: string;
  selesai: string;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export type Facility = {
  id: number;
  slug: string;
  title: string;
  image: string;
};

export type Slider = {
  id: number;
  title: string;
  image: string;
};

export type FlowBooking = {
  id: number;
  desc: string;
};

export type Video = {
  id: number;
  video: string;
};

export type Contact = {
  id: number;
  alamat: string;
  email: string;
  telp: string;
};

export type VisionMission = {
  id: number;
  visi: any;
  misi: any;
};

export type TermAndCondition = {
  id: number;
  desc: any;
};

export type Complaint = {
  id: number;
  createdAt: string;
  Instansi: {
    name: string;
  };
  Layanan: {
    name: string;
  };
  judul: string;
};

export type GuestBook = {
  id: number;
  name: string;
  createdAt: string;
  pekerjaan: string;
  alamat: string;
  tujuan?: string | undefined | null;
};

export type ActiveQueue = {
  no: number;
  queueNumber: string;
  createdAt: string;
  status: boolean;
};

export type HistoryQueue = {
  no: number;
  queueNumber: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export const dataActive = {
  data: [
    {
      queueNumber: "ASC-001",
      createdAt: "2021-10-10",
      status: "Menunggu",
    },
  ],
};
