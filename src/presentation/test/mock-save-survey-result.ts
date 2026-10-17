import type { SurveyResultModel } from "@/domain/models";
import { mockSurveyResult } from "@/domain/test";
import type { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases";

export class SaveSurveyResultSpy implements SaveSurveyResult {
  callsCount = 0;
  params!: SaveSurveyResultParams;
  surveyResult = mockSurveyResult();

  async save(params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params;
    this.callsCount++;

    return await new Promise(resolve =>
      setTimeout(() => { resolve(this.surveyResult); }, 1000));
  }
}