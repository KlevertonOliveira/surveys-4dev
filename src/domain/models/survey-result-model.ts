export type SurveyResultAnswer = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
  isCurrentAccountAnswer: boolean;
};

export type SurveyResultModel = {
  surveyId: string;
  question: string;
  date: Date;
  answers: SurveyResultAnswer[];
};