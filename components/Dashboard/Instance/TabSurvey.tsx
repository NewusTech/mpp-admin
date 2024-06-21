import LineChart from "@/components/Dashboard/ChartDashboard/line";
import { ProgressBar } from "@/components/Dashboard/Superadmin";

const TabSurvey = () => {
  return (
    <section className="space-y-4 mt-8">
      <div className="w-full flex gap-x-4">
        <div className="rounded-[16px] w-6/12 bg-neutral-50 shadow p-4">
          <LineChart />
        </div>
        <div className="rounded-[16px] w-6/12 bg-primary-700 p-4 flex flex-col justify-center items-center space-y-5">
          <p className="text-center text-primary-800 text-[20px] font-semibold">
            Total Nilai SKM Keseluruhan
          </p>
          <h4 className="font-semibold text-[40px] text-neutral-50">89.19</h4>
          <p className="text-secondary-700">Sangat Baik</p>
        </div>
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 p-8 shadow space-y-8">
        <div className="flex items-center gap-x-2">
          <h1 className="text-primary-700 font-medium text-[16px]">
            Total Nilai SKM Per-Layanan
          </h1>
          <p className="text-neutral-800 font-semibold text-[10px]">2024</p>
        </div>
        <ProgressBar name="Nama Instansi" value={10} />
        <ProgressBar name="Nama Instansi" value={20} />
        <ProgressBar name="Nama Instansi" value={30} />
        <ProgressBar name="Nama Instansi" value={40} />
        <ProgressBar name="Nama Instansi" value={50} />
        <ProgressBar name="Nama Instansi" value={60} />
        <ProgressBar name="Nama Instansi" value={70} />
        <ProgressBar name="Nama Instansi" value={80} />
        <ProgressBar name="Nama Instansi" value={90} />
        <ProgressBar name="Nama Instansi" value={100} />
      </div>
    </section>
  );
};

export default TabSurvey;
