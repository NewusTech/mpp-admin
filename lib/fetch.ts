"use client";

import Cookies from "js-cookie";
const token = Cookies.get("token");

export const fetcher = (url: string) => {
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
