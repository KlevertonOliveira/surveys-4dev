/* eslint-disable @typescript-eslint/no-empty-function */

import { render, screen } from "@testing-library/react";
import SurveyResultAnswer from "./survey-result-answer";
import { mockSurveyResult } from "@/domain/test";
import { SurveyResultContext } from "../../contexts/survey-result-context";
import type { SurveyResultAnswer as SurveyResultAnswerType } from "@/domain/models";

const makeSut = (answer: SurveyResultAnswerType) => {
  render(
    <SurveyResultContext value={{ onAnswer: () => { } }}>
      <SurveyResultAnswer answer={answer} />
    </SurveyResultContext>
  );
};

describe('SurveyResultAnswer', () => {
  test('should correctly display all values (with image)', () => {
    const firstAnswer = mockSurveyResult().answers[0];
    makeSut(firstAnswer);

    expect(screen.getByTestId("survey-result-answer")).toHaveAttribute("data-active", "true");
    expect(screen.getByTestId("image")).toHaveAttribute("src", firstAnswer.image);
    expect(screen.getByTestId("image")).toHaveAttribute("alt", firstAnswer.answer);
    expect(screen.getByTestId("description")).toHaveTextContent(firstAnswer.answer);
    expect(screen.getByTestId("percent")).toHaveTextContent(firstAnswer.percent.toString() + "%");
  });

  test('should correctly display all values (without image)', () => {
    const secondAnswer = mockSurveyResult().answers[1];
    makeSut(secondAnswer);

    expect(screen.getByTestId("survey-result-answer")).toHaveAttribute("data-active", "false");
    expect(screen.queryByTestId("image")).not.toBeInTheDocument();
    expect(screen.getByTestId("description")).toHaveTextContent(secondAnswer.answer);
    expect(screen.getByTestId("percent")).toHaveTextContent(secondAnswer.percent.toString() + "%");
  });
});