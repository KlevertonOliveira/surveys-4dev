import { makeApiURL } from "@/main/factories/http";
import { makeAuthorizeHttpClientDecorator } from "../../decorators";
import type { SaveSurveyResult } from "@/domain/usecases";
import { RemoteSaveSurveyResult } from "@/data/usecases";

export const makeRemoteSaveSurveyResult = (id: string): SaveSurveyResult => {
  return new RemoteSaveSurveyResult(
    makeApiURL(`/surveys/${id}/results`),
    makeAuthorizeHttpClientDecorator()
  );
};