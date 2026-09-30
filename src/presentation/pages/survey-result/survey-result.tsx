import type { LoadSurveyResult } from "@/domain/usecases";
import { Error, Footer, Header } from "@/presentation/components";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react/jsx-runtime";
import { SurveyResultData, SurveyResultSkeleton } from "./components";

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

export default function SurveyResultPage({ loadSurveyResult }: Props): JSX.Element {
  const {
    data: surveyResult,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["load-survey-result"],
    queryFn: async () => loadSurveyResult.load(),
  });

  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-background">
      <Header />

      {isLoading && <SurveyResultSkeleton />}

      {!isLoading && surveyResult && (
        <SurveyResultData surveyResult={surveyResult} />
      )}

      {!isLoading && isError && (
        <Error
          error={error}
          onRetry={() => refetch()}
        />
      )}

      <Footer />
    </div>
  );
}