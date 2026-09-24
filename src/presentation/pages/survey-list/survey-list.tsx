import { useQuery } from "@tanstack/react-query";
import type { LoadSurveyList } from "@/domain/usecases";
import { Footer, Header, Error } from "@/presentation/components";
import { SurveyItem, SurveyItemSkeleton, SurveyList } from "./components/";

type Props = {
  loadSurveyList: LoadSurveyList;
};

export default function SurveyListPage({ loadSurveyList }: Props) {
  const {
    data: surveyList,
    isFetching,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ["load-survey-list"],
    queryFn: async () => loadSurveyList.loadAll(),
    initialData: [],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-disabled-background">
      <Header />

      <div className="flex flex-col self-center max-w-200 grow w-full px-5 py-10">
        <h2 className="text-primaryDark text-xl font-bold uppercase mb-6">
          Surveys
        </h2>

        {isFetching && (
          <SurveyList>
            {Array(4).fill("").map((_, index) => <SurveyItemSkeleton key={index} />)}
          </SurveyList>
        )}

        {(!isFetching && surveyList.length > 0) && (
          <SurveyList>
            {surveyList.map((survey) => <SurveyItem key={survey.id} survey={survey} />)}
          </SurveyList>
        )}

        {(!isFetching && isError) && (
          <Error
            error={error}
            onRetry={() => refetch()}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}