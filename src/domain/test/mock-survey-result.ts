import { faker } from "@faker-js/faker";
import type { SurveyResultModel } from "@/domain/models";

export const mockSurveyResult = (): SurveyResultModel => {
  return {
    surveyId: faker.string.uuid(),
    question: faker.word.words(5),
    date: faker.date.recent(),
    answers: [
      {
        answer: faker.lorem.words(8),
        count: faker.number.int(),
        percent: faker.number.int({ max: 100 }),
        image: faker.internet.url(),
        isCurrentAccountAnswer: true,
      },
      {
        answer: faker.lorem.words(8),
        count: faker.number.int(),
        percent: faker.number.int({ max: 100 }),
        isCurrentAccountAnswer: false,
      }
    ]
  };
};