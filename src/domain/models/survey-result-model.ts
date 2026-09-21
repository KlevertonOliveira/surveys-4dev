type Answer = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
};

export type SurveyResultModel = {
  surveyId: string;
  question: string;
  date: Date;
  answers: Answer[];
};