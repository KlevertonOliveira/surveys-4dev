import { render, screen } from "@testing-library/react";
import { mockSurveyModel } from "@/domain/test/mock-survey-list";
import SurveyItem from "./survey-item";

const makeSut = (survey = mockSurveyModel()): void => {
  render(<SurveyItem survey={survey} />);
};

describe("SurveyItem Component", () => {
  test("Should render with correct values (survey not answered)", () => {
    const survey = { ...mockSurveyModel(), didAnswer: false };
    makeSut(survey);

    expect(screen.getByTestId("question-mark-icon")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
  });

  test("Should render with correct values (survey answered)", () => {
    const survey = { ...mockSurveyModel(), didAnswer: true };
    makeSut(survey);

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
  });
});