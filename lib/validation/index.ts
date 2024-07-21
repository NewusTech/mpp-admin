import { z } from "zod";

export const SigninValidation = z.object({
  nik: z.string({
    message: "NIK wajib diisi.",
  }),
  password: z.string().min(6, {
    message: "Password setidaknya harus 8 karakter.",
  }),
});

export const NewsValidation = z.object({
  title: z.string({
    message: "Wajib isi.",
  }),
  description: z.string().min(25, {
    message: "Deskripsi setidaknya harus 25 karakter.",
  }),
  image: z.custom<File[]>(),
});

export const AppsValidation = z.object({
  name: z.string({
    message: "Wajib isi.",
  }),
  description: z.string().min(25, {
    message: "Deskripsi setidaknya harus 25 karakter.",
  }),
  link: z.string({
    message: "Deskripsi setidaknya harus 25 karakter.",
  }),
  image: z.custom<File[]>(),
});

export const InstanceValidation = z.object({
  name: z.string({
    message: "Nama dinas wajib diisi",
  }),
  desc: z.string().min(25, {
    message: "Deskripsi setidaknya harus 25 karakter.",
  }),
  status: z.enum(["0", "1"], {
    required_error: "Kamu harus pilih status",
  }),
  image: z.custom<File[]>().optional(),
  address: z.string({ message: "Alamat wajib diisi" }),
  phone: z.string().max(15, { message: "No. Telfon wajib diisi" }),
  pj: z.string({ message: "PJ wajib diisi" }),
  nip_pj: z.string({ message: "NIP PJ wajib diisi" }),
  active_offline: z.enum(["0", "1"], {
    required_error: "Kamu harus pilih salah satu",
  }),
  active_online: z.enum(["0", "1"], {
    required_error: "Kamu harus pilih salah satu",
  }),
  open: z.string(),
  closed: z.string(),
  code: z
    .string()
    .min(2, { message: "Kode setidaknya harus 3 karakter." })
    .max(3, { message: "Kode maksimal 3 karakter" }),
});

export const FAQValidation = z.object({
  question: z.string({
    message: "Pertanyaan harus diisi",
  }),
  answer: z.string().min(15, {
    message: "Jawaban setidaknya harus 15 karakter.",
  }),
});

export const SurveyValidation = z.object({
  field: z.string({
    message: "Pertanyaan harus diisi",
  }),
  status: z.enum(["0", "1"], {
    required_error: "Harus pilih status.",
  }),
});

export const ServiceValidation = z.object({
  name: z.string({
    message: "Pertanyaan harus diisi",
  }),
  status: z.enum(["0", "1"], {
    required_error: "Kamu harus pilih status",
  }),
  instansi_id: z
    .string({
      message: "Kamu harus pilih instansi",
    })
    .transform((val) => Number(val)),
  desc: z.string().min(15, {
    message: "Jawaban setidaknya harus 15 karakter.",
  }),
});

export const FacilitiesValidation = z.object({
  image: z.custom<File[]>(),
  title: z.string({
    message: "Wajib diisi",
  }),
});

export const carouselValidation = z.object({
  image: z.custom<File[]>(),
});

export const FlowValidation = z.object({
  title: z.string({ message: "Wajib Diisi" }),
  image: z.custom<File[]>(),
});

export const FlowBookingValidation = z.object({
  desc: z.string({ message: "Wajib Diisi" }),
});

// Skema lengkap untuk validasi formulir dengan file video
export const uploadVideoSchema = z.object({
  video: z.custom<File[]>(),
});

export const userValidation = z.object({
  name: z.string({
    message: "Nama harus diisi",
  }),
  nik: z.string({
    message: "NIK harus diisi",
  }),
  email: z.string({
    message: "Email harus diisi",
  }),
  agama: z.string().optional(),
  telepon: z.string().optional(),
  alamat: z.string().optional(),
  tempat_lahir: z.string().optional(),
  tgl_lahir: z.date().optional(),
  status_kawin: z.string().optional(),
  gender: z.string().optional(),
  pekerjaan: z.string().optional(),
  goldar: z.string().optional(),
  pendidikan: z.string().optional(),
  kecamatan_id: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  desa_id: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
});

export const ContactValidation = z.object({
  alamat: z.string({
    message: "Alamat harus diisi",
  }),
  email: z.string({
    message: "Email harus diisi",
  }),
  telp: z.string({
    message: "Telp harus diisi",
  }),
  latitude: z.string({
    message: "Garis lintang harus diisi",
  }),
  longitude: z.string({
    message: "Garis bujur harus diisi",
  }),
});

export const ManualBookValidation = z.object({
  file: z.instanceof(FileList),
  video: z.custom<File[]>(),
});
