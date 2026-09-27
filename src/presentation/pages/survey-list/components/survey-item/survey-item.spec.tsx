import { render, screen } from "@testing-library/react";
import { mockSurveyModel } from "@/domain/test/mock-survey-list";
import SurveyItem from "./survey-item";

const makeSut = (survey = mockSurveyModel()): void => {
  render(<SurveyItem survey={survey} />);
};

describe("SurveyItem Component", () => {
  test("Should render with correct values (survey not answered)", () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: false,
      date: new Date("2026-10-15T11:12:19.939Z")
    };

    makeSut(survey);

    expect(screen.getByTestId("question-mark-icon")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("15");
    expect(screen.getByTestId("month")).toHaveTextContent("Oct");
    expect(screen.getByTestId("year")).toHaveTextContent("2026");
  });

  test("Should render with correct values (survey answered)", () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: true,
      date: new Date("2025-02-10T11:12:19.939Z")
    };

    makeSut(survey);

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("10");
    expect(screen.getByTestId("month")).toHaveTextContent("Feb");
    expect(screen.getByTestId("year")).toHaveTextContent("2025");
  });
});