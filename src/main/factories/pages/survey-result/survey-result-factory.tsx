import { SurveyResultPage } from "@/presentation/pages";
import { makeRemoteLoadSurveyResult } from "@/main/factories/usecases";
import { useParams } from "@tanstack/react-router";

export default function MakeSurveyResultPage(): React.JSX.Element {
  const { surveyId } = useParams({ from: "/surveys/$surveyId" });

  return (
    <SurveyResultPage loadSurveyResult={makeRemoteLoadSurveyResult(surveyId)} />
  );
}