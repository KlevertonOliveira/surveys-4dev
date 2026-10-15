import { createContext } from "react";

type ContextData = {
  onAnswer: (answer: string) => void;
};

export const SurveyResultContext = createContext<ContextData | null>(null);