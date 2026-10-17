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
    isFetching: isFetchingResult,
    isError: isFetchError,
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ["load-survey-result"],
    queryFn: async () => loadSurveyResult.load(),
  });

  const {
    mutate: saveResult,
    isPending: isSavingResult,
    isError: isSaveError,
    error: saveError,
    reset: resetSaveStatus,
  } = useMutation({
    mutationFn: async ({ answer }: { answer: string; }) => {
      return await saveSurveyResult.save({ answer });
    },
    onSuccess: () => refetch()
  });

  if (isFetchingResult) {
    return (
      <SurveyResultWrapper>
        <SurveyResultSkeleton />
      </SurveyResultWrapper>
    );
  }

  if (isFetchError) {
    return (
      <SurveyResultWrapper>
        <Error
          error={fetchError}
          onRetry={() => refetch()}
        />
      </SurveyResultWrapper>
    );
  }

  if (isSavingResult) {
    return (
      <SurveyResultWrapper>
        <LoadingScreen />
      </SurveyResultWrapper>
    );
  }

  if (isSaveError) {
    return (
      <SurveyResultWrapper>
        <Error
          error={saveError}
          onRetry={() => {
            resetSaveStatus();
            refetch();
          }}
        />
      </SurveyResultWrapper>
    );
  }

  return (
    <SurveyResultWrapper>
      <SurveyResultContext value={{ onAnswer: (answer) => saveResult({ answer }) }}>
        <SurveyResultData surveyResult={surveyResult!} />
      </SurveyResultContext>
    </SurveyResultWrapper>
  );
}

function SurveyResultWrapper({ children }: { children: JSX.Element; }): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-background">
      <Header />

      <div className="max-w-200 w-full mx-auto">
        {children}
      </div>

      <Footer />
    </div>
  );
}