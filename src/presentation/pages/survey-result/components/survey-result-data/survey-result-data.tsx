import type { SurveyResultModel } from "@/domain/models";
import { Calendar } from "@/presentation/components";
import { SurveyResultAnswer } from "@/presentation/pages/survey-result/components";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  surveyResult: SurveyResultModel;
};

export default function SurveyResultData({ surveyResult }: Props) {
  const navigate = useNavigate();

  return (
    <div
      data-testid="survey-result"
      className="flex flex-col self-center max-w-200 grow w-full px-5 py-10"
    >
      <hgroup className="flex items-center mb-4 gap-4">
        <Calendar date={surveyResult.date} className="w-20" />

        <h2
          data-testid="question"
          className="text-primaryDark text-2xl font-bold uppercase mb-6"
        >
          {surveyResult.question}
        </h2>
      </hgroup>

      <ul
        data-testid="answers"
        className="flex flex-col gap-4"
      >
        {surveyResult.answers.map(answer => (
          <SurveyResultAnswer key={answer.answer} answer={answer} />
        ))}
      </ul>

      <button
        className="mt-6"
        data-testid="return-button"
        onClick={() => navigate({ to: "/" })}
      >
        Back
      </button>
    </div>
  );
}