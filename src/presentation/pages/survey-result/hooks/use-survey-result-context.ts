import { useContext } from "react";
import { SurveyResultContext } from "@/presentation/pages/survey-result/contexts/survey-result-context";

export function useSurveyResultContext() {
  const context = useContext(SurveyResultContext);

  if (!context) {
    throw new Error("useSurveyResultContext must be used within a SurveyResultProvider");
  }

  return context;
}