import { render, screen } from "@testing-library/react";
import { SurveyResultPage } from "@/presentation/pages";
import { generateTestRouter, TestQueryClientProvider } from "@/utils/test";
import { routeAuth } from "@/utils/route-auth";
import { mockAccountModel } from "@/domain/test";
import { RouterProvider } from "@tanstack/react-router";
import { LoadSurveyResultSpy } from "@/presentation/test";

type SutTypes = {
  router: ReturnType<typeof generateTestRouter>;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy();

  const router = generateTestRouter({
    initialLocation: '/surveys',
    rootRoutecomponent: (
      <SurveyResultPage loadSurveyResult={loadSurveyResultSpy} />
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
    router,
    loadSurveyResultSpy
  };
};

describe('SurveyResult Component', () => {
  test("Should present skeleton component on start", async () => {
    makeSut();
    await screen.findByRole("banner");

    expect(screen.getByTestId("survey-result-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  test("Should call LoadSurveyResult", async () => {
    const { loadSurveyResultSpy } = makeSut();
    await screen.findByRole("banner");
    expect(loadSurveyResultSpy.callsCount).toBe(1);
  });
});