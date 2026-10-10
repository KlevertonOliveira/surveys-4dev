import type { SurveyResultModel } from "@/domain/models";

type Params = {
  answer: string;
};

export interface SaveSurveyResult {
  save: (params: Params) => Promise<SurveyResultModel>;
}