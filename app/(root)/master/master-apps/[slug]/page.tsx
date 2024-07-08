import Link from "next/link";
import Image from "next/image";
import Apps from "@/components/Form/Apps";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getDataBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/aplikasietc/get/${slug}`,
    {
      cache: "no-cache",
    },
  );
  const data = await res.json();
  return data.data;
}

const EditArticle = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const data = await getDataBySlug(params.slug);

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/master/master-apps">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="-mt-[78px]">
          <h1 className="text-2xl text-primary-700 font-bold">
            Ubah Aplikasi Dinas
          </h1>
          <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
            <h1 className="text-xl font-semibold mb-4">Aplikasi Dinas</h1>
            <Apps data={data} label="Ubah" />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default EditArticle;
