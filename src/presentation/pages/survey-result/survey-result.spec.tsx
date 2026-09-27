import { render, screen } from "@testing-library/react";
import { SurveyResultPage } from "@/presentation/pages";
import { generateTestRouter, TestQueryClientProvider } from "@/utils/test";
import { routeAuth } from "@/utils/route-auth";
import { mockAccountModel } from "@/domain/test";
import { RouterProvider } from "@tanstack/react-router";

type SutTypes = {
  router: ReturnType<typeof generateTestRouter>;
};

const makeSut = (): SutTypes => {
  const router = generateTestRouter({
    initialLocation: '/surveys',
    rootRoutecomponent: (
      <SurveyResultPage />
    ),
    context: {
      routeAuth: {
        ...routeAuth,
        getAccount: vi.fn().mockReturnValue(mockAccountModel()),
      },
    }
  });

  render(
    <TestQueryClientProvider>
      <RouterProvider router={router} />
    </TestQueryClientProvider>
  );

  return {
    router
  };
};

describe('SurveyResult Component', () => {
  test("Should present skeleton component on start", async () => {
    makeSut();
    await screen.findByRole("banner");

    expect(screen.getByTestId("survey-result-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});