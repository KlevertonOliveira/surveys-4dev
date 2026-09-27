import type { JSX } from "react/jsx-runtime";

export default function SurveyResultSkeleton(): JSX.Element {
  return (
    <div
      data-testid="survey-result-skeleton"
      className="flex flex-col self-center max-w-200 grow w-full px-5 py-10 animate-pulse"
    >

      <hgroup className="flex items-center mb-4 gap-4">
        <div className="w-20 h-25 rounded-lg bg-disabled-background" />

        <div className="w-full flex flex-col gap-2 mr-4">
          <div className="h-5 w-3/4 bg-disabled-background" />
          <div className="h-5 w-2/3 bg-disabled-background" />
          <div className="h-5 w-5/6 bg-disabled-background" />
        </div>
      </hgroup>

      <div className="w-full h-20 bg-disabled-background rounded-lg mb-4" />
      <div className="w-full h-20 bg-disabled-background rounded-lg mb-4" />
      <div className="w-full h-20 bg-disabled-background rounded-lg mb-4" />

      <div className="h-15 bg-disabled-background rounded-lg" />
    </div>
  );
}