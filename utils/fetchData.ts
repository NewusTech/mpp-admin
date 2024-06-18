import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export async function postData<T>(url: string, payload: any): Promise<T> {
  const router = useRouter();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.ok) {
    Cookies.set("token", data.data.token);
    toast(data.message);
    router.push("/");
  }

  return data;
}
