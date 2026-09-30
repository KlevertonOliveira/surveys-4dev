import MakeSurveyResultPage from "@/main/factories/pages/survey-result/survey-result-factory";
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute("/surveys/$surveyId")({
  beforeLoad: ({ context }) => {
    if (!context.routeAuth.isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: MakeSurveyResultPage
});
