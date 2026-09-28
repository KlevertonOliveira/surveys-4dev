import type { SurveyResultAnswer } from "@/domain/models";
import type { JSX } from "react/jsx-runtime";

type Props = {
  answer: SurveyResultAnswer;
  isCurrentAccountAnswer: boolean;
};

export default function SurveyResultAnswer({
  answer,
  isCurrentAccountAnswer
}: Props): JSX.Element {
  return (
    <li
      data-active={isCurrentAccountAnswer}
      data-testid="survey-result-answer"
      className={`flex justify-between bg-white items-center p-4 rounded-lg text-primaryDark 
      ${isCurrentAccountAnswer ? "border-2 border-primaryLight" : ""}`}
    >
      {answer.image && (
        <img
          src={answer.image}
          alt={answer.answer}
          className="w-12 h-12 mr-4"
          data-testid="image"
        />
      )}

      <span
        className="grow my-0 mr-4 text-xl"
        data-testid="description"
      >
        {answer.answer}
      </span>

      <span
        data-testid="percent"
        className="text-3xl"
      >
        {answer.percent}%
      </span>
    </li>
  );
}