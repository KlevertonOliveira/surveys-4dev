

import type { JSX } from "react/jsx-runtime";
import FlipMove from "react-flip-move";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Footer, Header } from "@/presentation/components";
import type { LoadSurveyResult } from "@/domain/usecases";
import { SurveyResultAnswer, SurveyResultSkeleton } from "./components";

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

export default function SurveyResultPage({ loadSurveyResult }: Props): JSX.Element {
  const { isLoading } = useQuery({
    queryKey: ["load-survey-result"],
    queryFn: async () => loadSurveyResult.load(),
  });

  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-background">
      <Header />

      {isLoading && <SurveyResultSkeleton />}

      {!isLoading && (
        <div
          data-testid="survey-result"
          className="flex flex-col self-center max-w-200 grow w-full px-5 py-10"
        >
          <hgroup className="flex items-center mb-4 gap-4">
            <Calendar date={new Date()} className="w-20" />

            <h2 className="text-primaryDark text-2xl font-bold uppercase mb-6">
              What&apos;s your favorite web framework?
            </h2>
          </hgroup>

          <FlipMove className="flex flex-col gap-4">
            <SurveyResultAnswer />
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