import { render, screen } from "@testing-library/react";
import { SurveyResultPage } from "@/presentation/pages";
import { generateTestRouter, TestQueryClientProvider } from "@/utils/test";
import { routeAuth } from "@/utils/route-auth";
import { mockAccountModel, mockSurveyResult } from "@/domain/test";
import { RouterProvider } from "@tanstack/react-router";
import { LoadSurveyResultSpy } from "@/presentation/test";

type SutTypes = {
  router: ReturnType<typeof generateTestRouter>;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (surveyResult = mockSurveyResult()): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  loadSurveyResultSpy.surveyResult = surveyResult;

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

  test("Should present SurveyResult data on success", async () => {
    const surveyResult = {
      ...mockSurveyResult(),
      date: new Date("2020-01-12T00:00:00")
    };
    makeSut(surveyResult);

    await screen.findByTestId("survey-result");

    expect(screen.getByTestId("day")).toHaveTextContent("12");
    expect(screen.getByTestId("month")).toHaveTextContent("Jan");
    expect(screen.getByTestId("year")).toHaveTextContent("2020");
    expect(screen.getByTestId("question")).toHaveTextContent(surveyResult.question);
    expect(screen.getAllByTestId("survey-result-answer")).toHaveLength(2);
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});