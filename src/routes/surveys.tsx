import { SurveyResultPage } from "@/presentation/pages";
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/surveys')({
  beforeLoad: ({ context }) => {
    if (!context.routeAuth.isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: SurveyResultPage,
});
