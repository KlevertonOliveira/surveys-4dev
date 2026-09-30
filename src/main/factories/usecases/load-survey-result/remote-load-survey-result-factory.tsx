import { RemoteLoadSurveyResult } from "@/data/usecases/load-survey-result/remote-load-survey-result";
import { makeApiURL } from "@/main/factories/http";
import { makeAuthorizeHttpGetClientDecorator } from "../../decorators";
import type { LoadSurveyResult } from "@/domain/usecases";

export const makeRemoteLoadSurveyResult = (id: string): LoadSurveyResult => {
  return new RemoteLoadSurveyResult(makeApiURL(`/surveys/${id}/results`), makeAuthorizeHttpGetClientDecorator());
};