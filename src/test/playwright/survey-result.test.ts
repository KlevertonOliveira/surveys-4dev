/* eslint-disable @typescript-eslint/no-empty-function */
import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";
import * as HTTP from "@/test/api-mocks/api-mocks";
import surveyResult from "@/test/fixtures/survey-result.json" with { type: "json" };

const apiURL = "/surveys/any_id/results";
const getPageURL = (baseURL: string) => `${baseURL}/surveys/any_id`;

test.describe("SurveyResultPage", () => {
  test.describe("Load", () => {
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

    test("Should present survey result skeleton when fetching data", async ({ page, baseURL }) => {
      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: surveyResult,
        callback: async () => await new Promise(() => { })
      });

      await page.goto(getPageURL(baseURL!), { waitUntil: "load" });

      await expect(page.getByTestId("survey-result-skeleton")).toBeVisible();
    });

    test("Should present survey result when fetch is successful", async ({ page, baseURL }) => {
      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: surveyResult,
      });

      await page.goto(getPageURL(baseURL!), { waitUntil: "load" });

      await expect(page.getByTestId("survey-result")).toBeVisible();

      expect(page.getByTestId("question")).toHaveText("Question 1");
      expect(page.getByTestId("day")).toHaveText("16");
      expect(page.getByTestId("month")).toHaveText("May");
      expect(page.getByTestId("year")).toHaveText("2026");

      const answers = page.getByTestId("survey-result-answer");
      await expect(answers).toHaveCount(2);

      const firstAnswer = answers.first();
      await expect(firstAnswer).toHaveAttribute("data-active", "true");
      await expect(firstAnswer.getByTestId("description")).toHaveText("Lorem ipsum 0001");
      await expect(firstAnswer.getByTestId("percent")).toHaveText("52%");
      await expect(firstAnswer.getByTestId("image")).toHaveAttribute("src", "any_image_1");

      const secondAnswer = answers.nth(1);
      await expect(secondAnswer).toHaveAttribute("data-active", "false");
      await expect(secondAnswer.getByTestId("description")).toHaveText("Lorem ipsum 0002");
      await expect(secondAnswer.getByTestId("percent")).toHaveText("48%");
      await expect(secondAnswer.getByTestId("image")).not.toBeVisible();
    });

    test("Should return to survey list page on 'Back' button click", async ({ page, baseURL }) => {
      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: surveyResult,
      });

      await page.goto(getPageURL(baseURL!), { waitUntil: "load" });

      const returnButton = page.getByTestId("return-button");
      await expect(returnButton).toBeVisible();
      await returnButton.click();

      await page.waitForURL("**/");
      expect(page.url()).toEqual(`${baseURL}/`);
    });
  });

  test.describe('Save', () => {
    test.beforeEach(async ({ page, baseURL }) => {
      const account = JSON.stringify(mockAccountModel());

      await page.addInitScript((account) => {
        localStorage.setItem("account", account);
      }, account);

      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: surveyResult,
      });

      await page.goto(getPageURL(baseURL!), { waitUntil: "load" });
    });

    test("Should present error message on UnexpectedError", async ({ page }) => {
      await expect(page.getByTestId("survey-result")).toBeVisible();

      await HTTP.mockServerError(page, apiURL);

      const firstNonActiveAnswer = page.getByTestId("survey-result-answer").nth(1);
      await expect(firstNonActiveAnswer).toBeVisible();
      await firstNonActiveAnswer.click();

      const errorMessage = page.getByTestId("error-message");

      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText("Something went wrong. Try again later.");
    });

    test("Should refetch on retry button click", async ({ page }) => {
      await expect(page.getByTestId("survey-result")).toBeVisible();

      await HTTP.mockServerError(page, apiURL);

      const firstNonActiveAnswer = page.getByTestId("survey-result-answer").nth(1);
      await expect(firstNonActiveAnswer).toBeVisible();
      await firstNonActiveAnswer.click();

      const errorMessage = page.getByTestId("error-message");

      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText("Something went wrong. Try again later.");

      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: surveyResult,
      });

      const retryButton = page.getByTestId("retry-button");
      await expect(retryButton).toBeVisible();
      await retryButton.click();

      await expect(page.getByTestId("survey-result")).toBeVisible();
    });

    test("Should logout on forbidden error (AccessDeniedError)", async ({ page, baseURL }) => {
      await expect(page.getByTestId("survey-result")).toBeVisible();

      await HTTP.mockForbiddenError(page, apiURL);

      const firstNonActiveAnswer = page.getByTestId("survey-result-answer").nth(1);
      await expect(firstNonActiveAnswer).toBeVisible();
      await firstNonActiveAnswer.click();

      await page.goto(getPageURL(baseURL!), { waitUntil: "load" });
      await page.waitForURL("**/login");
      expect(page.url()).toEqual(`${baseURL}/login`);
    });

    test("Should present loading screen while saving result", async ({ page }) => {
      await expect(page.getByTestId("survey-result")).toBeVisible();

      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: surveyResult,
        callback: async () => await new Promise(() => { })
      });

      const firstNonActiveAnswer = page.getByTestId("survey-result-answer").nth(1);
      await expect(firstNonActiveAnswer).toBeVisible();
      await firstNonActiveAnswer.click();

      await expect(page.getByTestId("loading-screen")).toBeVisible();
    });

    test("Should present correct result after save/refetch flow", async ({ page }) => {
      await expect(page.getByTestId("survey-result")).toBeVisible();

      const changedSurveyResult = {
        ...surveyResult,
        answers: surveyResult.answers.map((answer) => {
          return {
            ...answer,
            isCurrentAccountAnswer: !answer.isCurrentAccountAnswer
          };
        })
      };

      await HTTP.mockSuccessfulRequest({
        page,
        url: apiURL,
        response: changedSurveyResult,
      });

      await expect(page.getByTestId("survey-result-answer").nth(1)).toHaveAttribute("data-active", "false");
      await page.getByTestId("survey-result-answer").nth(1).click();

      await expect(page.getByTestId("survey-result-answer").nth(1)).toHaveAttribute("data-active", "true");
    });
  });
});