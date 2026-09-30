import { render, screen, waitFor } from "@testing-library/react";
import { mockSurveyModel } from "@/domain/test/mock-survey-list";
import SurveyItem from "./survey-item";
import { RouterProvider } from "@tanstack/react-router";
import { routeAuth } from "@/utils/route-auth";
import { mockAccountModel } from "@/domain/test";
import { generateTestRouter } from "@/utils/test";
import userEvent from "@testing-library/user-event";

type SutTypes = {
  router: ReturnType<typeof generateTestRouter>;
};

const makeSut = (survey = mockSurveyModel()): SutTypes => {
  const router = generateTestRouter({
    initialLocation: '/',
    rootRoutecomponent: (
      <SurveyItem survey={survey} />
    ),
    context: {
      routeAuth: {
        ...routeAuth,
        getAccount: vi.fn().mockReturnValue(mockAccountModel()),
      },
    }
  });

  render(
    <RouterProvider router={router} />
  );

  return { router };
};

describe("SurveyItem Component", () => {
  test("Should render with correct values (survey not answered)", async () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: false,
      date: new Date("2026-10-15T11:12:19.939Z")
    };

    makeSut(survey);

    await waitFor(() => screen.getByTestId("survey-item"));

    expect(screen.getByTestId("question-mark-icon")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("15");
    expect(screen.getByTestId("month")).toHaveTextContent("Oct");
    expect(screen.getByTestId("year")).toHaveTextContent("2026");
  });

  test("Should render with correct values (survey answered)", async () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: true,
      date: new Date("2025-02-10T11:12:19.939Z")
    };

    makeSut(survey);

    await waitFor(() => screen.getByTestId("survey-item"));

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("10");
    expect(screen.getByTestId("month")).toHaveTextContent("Feb");
    expect(screen.getByTestId("year")).toHaveTextContent("2025");
  });

  test("Should go to SurveyResult upon 'See Results' link interaction", async () => {
    const survey = mockSurveyModel();
    const { router } = makeSut(survey);

    await waitFor(() => screen.getByTestId("survey-item"));

    const user = userEvent.setup();
    await user.click(screen.getByTestId("go-to-result-link"));

    expect(router.state.location.pathname).toEqual(`/surveys/${survey.id}`);
  });
});