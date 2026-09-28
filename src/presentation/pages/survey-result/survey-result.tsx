import { Calendar, Footer, Header } from "@/presentation/components";
import { SurveyResultSkeleton, SurveyResultAnswer } from "./components";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react/jsx-runtime";
import FlipMove from "react-flip-move";
import type { LoadSurveyResult } from "@/domain/usecases";

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

export default function SurveyResultPage({ loadSurveyResult }: Props): JSX.Element {
  const { data: surveyResult, isLoading } = useQuery({
    queryKey: ["load-survey-result"],
    queryFn: async () => loadSurveyResult.load(),
  });

  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-background">
      <Header />

      {isLoading && <SurveyResultSkeleton />}

      {!isLoading && surveyResult && (
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

          <FlipMove
            data-testid="answers"
            className="flex flex-col gap-4"
          >
            {surveyResult.answers.map(answer => (
              <div key={answer.answer}>
                <SurveyResultAnswer
                  answer={answer}
                  isCurrentAccountAnswer={surveyResult.isCurrentAccountAnswer}
                />
              </div>
            ))}
          </FlipMove>

          <button className="mt-6">
            Back
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}