"use client";

import Cookies from "js-cookie";

export const fetcher = (url: string) => {
  const token = Cookies.get("token");
  // Atau ambil dari state/context
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
};

export const fetcherWithoutAuth = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const dataKiosk = {
  status: 200,
  message: "success get",
  data: {
    AntrianCount: 10,
    AntrianProsesCount: 1,
    AntrianNextCount: 9,
    monthlyAntrianCounts: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 18,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    },
    permohonanan_bulan: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 18,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    },
  },
};

export const dataGuestBook = {
  status: 200,
  message: "success get Bukutamu",
  data: [
    {
      id: 48,
      name: "Muhammad Muttaqin Muttaqin",
      instansi_id: 6,
      pekerjaan: "Pengacara (Pengangguran Banyak Acara)",
      alamat: "Jl. Landak, Gunung Agung, Kec Langkapura, Kota Bandar Lampung",
      tujuan: null,
      tanggal: "2024-07-04T00:00:00.000Z",
      waktu: "09:49:00",
      createdAt: "2024-07-12T02:47:49.704Z",
      updatedAt: "2024-07-12T02:47:49.704Z",
    },
    {
      id: 49,
      name: "Muhammad Muttaqin",
      instansi_id: 1,
      pekerjaan: "Pengacara (Pengangguran Banyak Acara)",
      alamat: "Jl. Kamboja, Gunung Agung",
      tujuan: "Silaturahmi",
      tanggal: "2024-07-13T00:00:00.000Z",
      waktu: "14:18:00",
      createdAt: "2024-07-13T07:14:38.033Z",
      updatedAt: "2024-07-13T07:14:38.033Z",
    },
  ],
  pagination: {
    page: 1,
    perPage: 10,
    totalPages: 1,
    totalCount: 2,
    links: {
      prev: null,
      next: null,
    },
  },
};

export const detailGuestBook = {
  status: 200,
  message: "success get Bukutamu by id",
  data: {
    id: 48,
    name: "Muhammad Muttaqin Muttaqin",
    instansi_id: 6,
    pekerjaan: "Pengacara (Pengangguran Banyak Acara)",
    alamat: "Jl. Landak, Gunung Agung, Kec Langkapura, Kota Bandar Lampung",
    tujuan: null,
    tanggal: "2024-07-04T00:00:00.000Z",
    waktu: "09:49:00",
    createdAt: "2024-07-12T02:47:49.704Z",
    updatedAt: "2024-07-12T02:47:49.704Z",
  },
};
