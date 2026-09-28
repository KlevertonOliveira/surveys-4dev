import { render, screen } from "@testing-library/react";
import SurveyResultAnswer from "./survey-result-answer";
import { mockSurveyResult } from "@/domain/test";

describe('SurveyResultAnswer', () => {
  test('should correctly display all values (with image)', () => {
    const firstAnswer = mockSurveyResult().answers[0];

    render(
      <SurveyResultAnswer answer={firstAnswer} />
    );

    expect(screen.getByTestId("survey-result-answer")).toBeInTheDocument();

    expect(screen.getByTestId("image")).toHaveAttribute("src", firstAnswer.image);
    expect(screen.getByTestId("image")).toHaveAttribute("alt", firstAnswer.answer);
    expect(screen.getByTestId("description")).toHaveTextContent(firstAnswer.answer);
    expect(screen.getByTestId("percent")).toHaveTextContent(firstAnswer.percent.toString() + "%");
  });

  test('should correctly display all values (without image)', () => {
    const secondAnswer = mockSurveyResult().answers[1];

    render(
      <SurveyResultAnswer answer={secondAnswer} />
    );

    expect(screen.getByTestId("survey-result-answer")).toBeInTheDocument();
    expect(screen.queryByTestId("image")).not.toBeInTheDocument();
    expect(screen.getByTestId("description")).toHaveTextContent(secondAnswer.answer);
    expect(screen.getByTestId("percent")).toHaveTextContent(secondAnswer.percent.toString() + "%");
  });
});