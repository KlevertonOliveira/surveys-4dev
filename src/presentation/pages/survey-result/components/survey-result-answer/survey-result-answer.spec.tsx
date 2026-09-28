import { render, screen } from "@testing-library/react";
import SurveyResultAnswer from "./survey-result-answer";
import { mockSurveyResult } from "@/domain/test";

describe('SurveyResultAnswer', () => {
  test('should display correct values (has image src value)', () => {
    const firstAnswer = mockSurveyResult().answers[0];

    render(
      <SurveyResultAnswer answer={firstAnswer} />
    );

    expect(screen.getByTestId("survey-result-answer")).toBeInTheDocument();

    expect(screen.getByTestId("image")).toHaveAttribute("src", firstAnswer.image);
    expect(screen.getByTestId("description")).toHaveTextContent(firstAnswer.answer);
    expect(screen.getByTestId("percent")).toHaveTextContent(firstAnswer.percent.toString() + "%");
  });
});