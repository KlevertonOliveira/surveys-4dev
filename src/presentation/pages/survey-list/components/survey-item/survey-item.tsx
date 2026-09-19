import type { SurveyModel } from "@/domain/models";
import { Icon, IconName } from "@/presentation/components";
import type React from "react";

type Props = {
  survey: SurveyModel;
};

export default function SurveyItem({ survey }: Props): React.JSX.Element {
  return (
    <li
      className="h-60 bg-white flex flex-col justify-between rounded-lg sm:basis-[48%] mb-6 shadow relative"
      data-testid="survey-item"
    >

      <Icon
        iconName={!survey.didAnswer ? IconName.questionMark : IconName.checkMark}
        className={`absolute -top-2 -right-2 text-white rounded-full 
           ${!survey.didAnswer ? "bg-red-600" : "bg-green-600"}`}
      />

      <div className="flex justify-between rounded-lg grow
        bg-[linear-gradient(to_right,rgb(from_var(--color-primaryLight)_r_g_b/20%)_0_12.5%,var(--color-white)_12.5%_100%)]
        bg-no-repeat 
        bg-size-[100%_100%]"
      >
        <time className="flex flex-col bg-primaryLight text-white rounded-lg ml-4 w-15 h-25 items-center self-center justify-center shrink-0">
          <span className="text-4xl font-bold" data-testid="day">
            {survey.date.getDate().toString().padStart(2, "0")}
          </span>

          <span className="m-0 mb-1" data-testid="month">
            {survey.date.toLocaleDateString("en-US", { month: "short" })}
          </span>

          <span data-testid="year">
            {survey.date.getFullYear()}
          </span>
        </time>

        <p className="text-xl m-6 self-center grow" data-testid="question">
          {survey.question}
        </p>
      </div>

      <footer className="bg-primary hover:bg-primaryDark text-white leading-10 lowercase text-center cursor-pointer rounded-b-lg"
      >
        See Result
      </footer>
    </li>
  );
}