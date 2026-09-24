import { twMerge } from "tailwind-merge";

type Props = {
  date: Date;
  className?: string;
};

export default function Calendar({
  date,
  className,
}: Props) {
  return (
    <time
      className={twMerge(
        "flex flex-col bg-primaryLight text-white rounded-lg ml-4 w-15 h-25 items-center self-center justify-center shrink-0",
        className
      )}>
      <span className="text-4xl font-bold" data-testid="day">
        {date.getDate().toString().padStart(2, "0")}
      </span>

      <span className="m-0 mb-1" data-testid="month">
        {date.toLocaleDateString("en-US", { month: "short" })}
      </span>

      <span data-testid="year">
        {date.getFullYear()}
      </span>
    </time>
  );
}