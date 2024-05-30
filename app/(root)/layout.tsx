import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Sidebar />
      <main className="md:pl-[350px] mt-32 font-poppins">{children}</main>
    </div>
  );
}
