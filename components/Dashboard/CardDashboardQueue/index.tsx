import { CardDashboardQueueProps } from "@/types/interface";

const CardDashboardQueue = ({
  title,
  number,
  background,
}: CardDashboardQueueProps) => {
  return (
    <div
      className={`w-full h-[152px] ${background} rounded-[20px] flex flex-col items-center justify-center gap-4`}
    >
      <h3 className="text-[16px] text-neutral-50 font-semibold">{title}</h3>
      <h1 className="text-[40px] text-neutral-50 font-bold">{number}</h1>
    </div>
  );
};

export default CardDashboardQueue;
