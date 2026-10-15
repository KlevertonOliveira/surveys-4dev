import type { LoadSurveyResult, SaveSurveyResult } from "@/domain/usecases";
import { Error, Footer, Header } from "@/presentation/components";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { JSX } from "react/jsx-runtime";
import { SurveyResultData, SurveyResultSkeleton } from "./components";
import LoadingScreen from "@/presentation/components/loading/loading";
import { SurveyResultContext } from "./contexts/survey-result-context";

type Props = {
  loadSurveyResult: LoadSurveyResult;
  saveSurveyResult: SaveSurveyResult;
};

export default function SurveyResultPage({
  loadSurveyResult,
  saveSurveyResult,
}: Props): JSX.Element {
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

  const {
    mutate: saveResult,
    isPending: isSavingResult,
  } = useMutation({
    mutationFn: async ({ answer }: { answer: string; }) => {
      return await saveSurveyResult.save({ answer });
    },
  });

  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-background">
      <Header />

      <SurveyResultContext value={{ onAnswer: (answer) => saveResult({ answer }) }}>
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

        {isSavingResult && <LoadingScreen />}
      </SurveyResultContext>

      <Footer />
    </div>
  );
}