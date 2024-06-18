export type Payment = {
  id: string;
  jenis: string;
  online: boolean;
  offline: boolean;
};

export type RequestOnline = {
  id: number;
  date: string;
  name: string;
  status: string;
};

export type RequestOffline = {
  id: number;
  date: string;
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
  name: string;
  slug: string;
};

export type DataServices = {
  id: number;
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
  role: string;
  status: string;
};

export type Report = {
  id: number;
  service: string;
  waiting: string;
  failed: string;
  success: string;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export type Facility = {
  id: number;
  image: string;
};
