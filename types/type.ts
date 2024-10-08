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
  nik: string;
  status: string;
  layanan_name: string;
};

export type RequestOffline = {
  id: number;
  createdAt: string;
  name: string;
  nik: string;
  status: string;
  layanan_name: string;
};

export type ManageApprovals = {
  id: number;
  createdAt: string;
  name: string;
  nik: string;
  status: string;
  layanan_name: string;
};

export type DataInstance = {
  id: number;
  no: number;
  name: string;
  slug: string;
};

export type InformationInstance = {
  id: number;
  no: number;
  title: string;
  content: string;
  image: string;
};

export type DataApps = {
  id: number;
  link: string;
  name: string;
  slug: string;
  image: string;
};

export type DataAppsInstance = {
  id: number;
  link: string;
  name: string;
  slug: string;
  file: string;
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
  desc: string;
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
  createdAt: string;
};

export type ManageAdmin = {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  Instansi: string;
  Role: string;
  createdAt: string;
};

export type Report = {
  id: number;
  name: string;
  menunggu: string;
  gagal: string;
  selesai: string;
};

export type ReportDoc = {
  id: number;
  name: string;
  nik: string;
  layanan_name: string;
  instansi_name: string;
  createdAt: string;
  fileoutput: string;
  filesertif: string;
};

export type ReportProb = {
  id: number;
  Userinfo: { name: string; nik: string };
  nik: string;
  Layanan: {
    name: string;
  };
  createdAt: string;
  judul: string;
  aduan: string;
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

export type ManualBook = {
  id: number;
  dokumen: string;
  video: string;
  role_name: string;
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
  latitude: string;
  longitude: string;
  website: string;
  desc: string;
};

export type VisionMission = {
  id: number;
  visi: any;
  misi: any;
  motto: any;
};

export type ServiceFile = {
  id: number;
  name: any;
  file: any;
};

export type TermAndCondition = {
  id: number;
  desc: any;
  privasi_text: string;
};

export type Maklumat = {
  id: number;
  desc: string;
};

export type Logo = {
  id: number;
  logo_mpp: string;
};

export type Announcement = {
  id: number;
  file: string;
};

export type SOPMPP = {
  id: number;
  file: string;
  name: string;
  desc: string;
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

export type HistoryQueue = {
  no: number;
  code: string;
  createdAt: string;
  finishedAt: string;
  status: boolean;
  timeprocess: string;
};

export type ReportGeo = {
  nik: string;
  name: string;
  email: string;
  telepon: string;
  kecamatan_name: string;
  desa_name: string;
  alamat: string;
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
