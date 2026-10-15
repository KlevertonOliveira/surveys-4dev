import type { SurveyResultModel } from "@/domain/models";
import { mockSurveyResult } from "@/domain/test";
import type { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases";

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params!: SaveSurveyResultParams;
  surveyResult = mockSurveyResult();

  async save(params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params;

    return await new Promise(resolve =>
      setTimeout(() => { resolve(this.surveyResult); }, 1000));
  }
}