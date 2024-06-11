import { z } from "zod";

export const SigninValidation = z.object({
  nik: z.string().min(8, {
    message: "NIK harus setidaknya 16 karakter.",
  }),
  password: z.string().min(6, {
    message: "Password setidaknya harus 8 karakter.",
  }),
});

export const NewsValidation = z.object({
  title: z.string({
    message: "NIK harus setidaknya 16 karakter.",
  }),
  description: z.string().min(25, {
    message: "Deskripsi setidaknya harus 25 karakter.",
  }),
  image: z.custom<File[]>(),
});
