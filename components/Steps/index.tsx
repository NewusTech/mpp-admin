import { CardStepProps } from "@/type/type";

const Step = ({ title, isLastStep, isActive }: CardStepProps) => {
  return (
    <div className="flex flex-row items-center">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center border border-primary-700 ${
          isActive ? "bg-primary-700" : "bg-transparent"
        }`}
      >
        <p className={isActive ? "text-neutral-50" : "text-primary-700"}>
          {title}
        </p>
      </div>
      {!isLastStep && <div className="w-[75px] bg-secondary-700 h-[1px]"></div>}
    </div>
  );
};

export default Step;
