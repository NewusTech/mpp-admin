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
  date: string;
  name: string;
  status: string;
};

export type DataInstance = {
  id: number;
  no: number;
  instance: string;
};

export type DataServices = {
  id: number;
  no: number;
  instance: string;
  service: string;
};

export type ManageRequirements = {
  id: number;
  instance: string;
  service: string;
};

export type SurveyResult = {
  id: number;
  service: string;
  total: string;
  value: string;
};

export type SurveyQuestion = {
  id: number;
  no: number;
  question: string;
};

export type DetailSurveyResult = {
  id: number;
  date: string;
  name: string;
  value: string;
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
