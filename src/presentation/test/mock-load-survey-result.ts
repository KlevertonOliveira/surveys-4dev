import type { SurveyResultModel } from "@/domain/models";
import { mockSurveyResult } from "@/domain/test";
import type { LoadSurveyResult } from "@/domain/usecases";

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0;
  surveyResult = mockSurveyResult();

  async load(): Promise<SurveyResultModel> {
    this.callsCount++;
    return this.surveyResult;
  }
}