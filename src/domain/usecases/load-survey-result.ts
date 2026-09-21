import type { SurveyResultModel } from "@/domain/models/survey-result-model";

export interface LoadSurveyResult {
  load: () => Promise<SurveyResultModel[]>;
}