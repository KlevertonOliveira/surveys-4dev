import { UnexpectedError } from "@/domain/errors";
import { mockAccountModel, mockSurveyResult } from "@/domain/test";
import { SurveyResultPage } from "@/presentation/pages";
import { LoadSurveyResultSpy } from "@/presentation/test";
import { SaveSurveyResultSpy } from "@/presentation/test/mock-save-survey-result";
import { routeAuth } from "@/utils/route-auth";
import { generateTestRouter, TestQueryClientProvider } from "@/utils/test";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type SutTypes = {
  router: ReturnType<typeof generateTestRouter>;
  loadSurveyResultSpy: LoadSurveyResultSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy;
  saveSurveyResultSpy?: SaveSurveyResultSpy;
};

const makeSut = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy()
}: SutParams = {} as SutParams): SutTypes => {
  const router = generateTestRouter({
    initialLocation: '/surveys',
    rootRoutecomponent: (
      <SurveyResultPage
        loadSurveyResult={loadSurveyResultSpy}
        saveSurveyResult={saveSurveyResultSpy}
      />
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
    loadSurveyResultSpy,
    saveSurveyResultSpy,
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

    makeSut({ loadSurveyResultSpy });

    await screen.findByTestId("survey-result");

    expect(screen.getByTestId("day")).toHaveTextContent("12");
    expect(screen.getByTestId("month")).toHaveTextContent("Jan");
    expect(screen.getByTestId("year")).toHaveTextContent("2020");
    expect(screen.getByTestId("question")).toHaveTextContent(surveyResult.question);
    expect(screen.getAllByTestId("survey-result-answer")).toHaveLength(2);
    expect(screen.getByTestId("return-button")).toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  test("Should return to survey list page ('/') when user clicks the 'Back' button", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    loadSurveyResultSpy.surveyResult = mockSurveyResult();

    const { router } = makeSut({ loadSurveyResultSpy });

    await screen.findByTestId("survey-result");
    const returnButton = screen.getByTestId("return-button");

    userEvent.setup();
    await userEvent.click(returnButton);

    expect(router.state.location.pathname).toBe("/");
  });

  test("Should render error on UnexpectedError", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    const error = new UnexpectedError();

    vi.spyOn(loadSurveyResultSpy, "load").mockRejectedValueOnce(error);
    makeSut({ loadSurveyResultSpy });

    const errorMessage = await screen.findByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(error.message);
    expect(screen.queryByTestId("survey-result")).not.toBeInTheDocument();
    expect(screen.queryByTestId("survey-result-skeleton")).not.toBeInTheDocument();
  });

  test("Should call LoadSurveyResult on refetch", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    const error = new UnexpectedError();

    vi.spyOn(loadSurveyResultSpy, "load").mockRejectedValueOnce(error);
    makeSut({ loadSurveyResultSpy });

    expect(await screen.findByTestId("error-message")).toBeInTheDocument();

    const retryButton = screen.getByTestId("retry-button");

    const user = userEvent.setup();
    await user.click(retryButton);

    // With the error mocked above, the callsCount was never updated since the "load" failed.
    // Thus, as the retry button calls "load" (now without mocked errors), the callsCount should be 1
    expect(loadSurveyResultSpy.callsCount).toBe(1);
  });

  test("Should not present LoadingScreen component on active answer click", async () => {
    makeSut();

    await screen.findByTestId("survey-result");

    const answers = screen.getAllByTestId("survey-result-answer");

    const user = userEvent.setup();
    await user.click(answers[0]);

    expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
  });

  test("Should call SaveSurveyResult on non-active answer click", async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut();

    await screen.findByTestId("survey-result");

    const answers = (screen.queryAllByTestId("survey-result-answer"));
    const firstNonActiveAnswer = answers[1];

    const user = userEvent.setup();
    await user.click(firstNonActiveAnswer);

    expect(screen.queryByTestId("loading-screen")).toBeInTheDocument();

    expect(saveSurveyResultSpy.params.answer)
      .toBe(loadSurveyResultSpy.surveyResult.answers[1].answer);
  });
});