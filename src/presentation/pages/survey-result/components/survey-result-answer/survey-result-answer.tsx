import type { SurveyResultAnswer } from "@/domain/models";
import type { JSX } from "react/jsx-runtime";
import { useSurveyResultContext } from "../../hooks/use-survey-result-context";

type Props = {
  answer: SurveyResultAnswer;
};

export default function SurveyResultAnswer({ answer }: Props): JSX.Element {
  const { onAnswer } = useSurveyResultContext();

  const answerClick = (): void => {
    if (answer.isCurrentAccountAnswer) return;
    onAnswer(answer.answer);
  };

  return (
    <button
      onClick={answerClick}
      data-active={answer.isCurrentAccountAnswer}
      data-testid="survey-result-answer"
      className={`flex justify-between bg-white items-center p-4 rounded-lg text-primaryDark
      ${answer.isCurrentAccountAnswer ? "border-2 border-primaryLight" : ""}`}
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
        className="grow my-0 mr-4 text-xl text-left"
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
    </button>
  );
}