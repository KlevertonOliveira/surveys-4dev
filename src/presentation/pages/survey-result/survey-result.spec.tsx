import { UnexpectedError } from "@/domain/errors";
import { mockAccountModel, mockSurveyResult } from "@/domain/test";
import { SurveyResultPage } from "@/presentation/pages";
import { LoadSurveyResultSpy } from "@/presentation/test";
import { routeAuth } from "@/utils/route-auth";
import { generateTestRouter, TestQueryClientProvider } from "@/utils/test";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";

type SutTypes = {
  router: ReturnType<typeof generateTestRouter>;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes => {
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

    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    loadSurveyResultSpy.surveyResult = surveyResult;

    makeSut(loadSurveyResultSpy);

    await screen.findByTestId("survey-result");

    expect(screen.getByTestId("day")).toHaveTextContent("12");
    expect(screen.getByTestId("month")).toHaveTextContent("Jan");
    expect(screen.getByTestId("year")).toHaveTextContent("2020");
    expect(screen.getByTestId("question")).toHaveTextContent(surveyResult.question);
    expect(screen.getAllByTestId("survey-result-answer")).toHaveLength(2);
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  test("Should render error on UnexpectedError", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    const error = new UnexpectedError();

    vi.spyOn(loadSurveyResultSpy, "load").mockRejectedValueOnce(error);
    makeSut(loadSurveyResultSpy);

    const errorMessage = await screen.findByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(error.message);
    expect(screen.queryByTestId("survey-result")).not.toBeInTheDocument();
    expect(screen.queryByTestId("survey-result-skeleton")).not.toBeInTheDocument();
  });
});