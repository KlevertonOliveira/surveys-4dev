
import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";
import * as HTTP from "@/test/api-mocks/api-mocks";
import surveyResult from "@/test/fixtures/survey-result.json" with { type: "json" };

const apiURL = "/surveys/any_id/results";
const getPageURL = (baseURL: string) => `${baseURL}/surveys/any_id`;

test.describe("SurveyResultPage", () => {
  test.beforeEach(async ({ page }) => {
    const account = JSON.stringify(mockAccountModel());

    await page.addInitScript((account) => {
      localStorage.setItem("account", account);
    }, account);
  });

  test("Should present error message on UnexpectedError", async ({ page, baseURL }) => {
    await HTTP.mockServerError(page, apiURL);
    await page.goto(getPageURL(baseURL!), { waitUntil: "load" });

    const errorMessage = page.getByTestId("error-message");

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("Something went wrong. Try again later.");
  });

  test("Should refetch on retry button click", async ({ page, baseURL }) => {
    await HTTP.mockServerError(page, apiURL);
    await page.goto(getPageURL(baseURL!), { waitUntil: "load" });

    await expect(page.getByTestId("error-message")).toHaveText("Something went wrong. Try again later.");

    await HTTP.mockSuccessfulRequest({
      page,
      url: apiURL,
      response: surveyResult,
    });

    const retryButton = page.getByTestId("retry-button");
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    await expect(page.getByTestId("question")).toHaveText(surveyResult.question);
  });

  test("Should logout on forbidden error (AccessDeniedError)", async ({ page, baseURL }) => {
    await HTTP.mockForbiddenError(page, apiURL);
    await page.goto(getPageURL(baseURL!), { waitUntil: "load" });

    await page.waitForURL("**/login");
    expect(page.url()).toEqual(`${baseURL}/login`);
  });
});