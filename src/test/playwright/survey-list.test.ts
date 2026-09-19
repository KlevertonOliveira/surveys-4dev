/* eslint-disable @typescript-eslint/no-empty-function */
import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";
import * as HTTP from "@/test/api-mocks/api-mocks";
import type { AccountModel } from "@/domain/models";
import surveys from "@/test/fixtures/surveys.json" with { type: "json" };

const apiURL = "/surveys";

test.describe("SurveyListPage", () => {
  test.beforeEach(async ({ page }) => {
    const account = JSON.stringify(mockAccountModel());

    await page.addInitScript((account) => {
      localStorage.setItem("account", account);
    }, account);
  });

  test("Should present error message on UnexpectedError", async ({ page, baseURL }) => {
    await HTTP.mockServerError(page, apiURL);
    await page.goto(`${baseURL}/`, { waitUntil: "load" });

    const errorMessage = page.getByTestId("error-message");

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("Something went wrong. Try again later.");
  });

  test("Should logout on forbidden error (AccessDeniedError)", async ({ page, baseURL }) => {
    await HTTP.mockForbiddenError(page, apiURL);
    await page.goto(`${baseURL}/`, { waitUntil: "load" });

    await page.waitForURL("**/login");
    expect(page.url()).toEqual(`${baseURL}/login`);
  });

  test("Should present correct username", async ({ page, baseURL }) => {
    await HTTP.mockServerError(page, apiURL);
    await page.goto(`${baseURL}/`, { waitUntil: "load" });

    const account: AccountModel = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("account")!);
    });

    const username = page.getByTestId("username");

    await expect(username).toBeVisible();
    await expect(username).toHaveText(account.name);
  });

  test("Should logout and redirect to '/login' on logout button click", async ({ page, baseURL }) => {
    await HTTP.mockServerError(page, apiURL);
    await page.goto(`${baseURL}/`, { waitUntil: "load" });

    const logoutButton = page.getByTestId("logout-button");

    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    expect(page.url()).toEqual(`${baseURL}/login`);
  });

  test("Should present skeleton survey items when fetching data", async ({ page, baseURL }) => {
    await HTTP.mockSuccessfulRequest({
      page,
      url: apiURL,
      response: surveys,
      callback: async () => await new Promise(() => { })
    });

    await page.goto(`${baseURL}/`, { waitUntil: "load" });

    await expect(page.getByTestId("skeleton-survey-item")).toHaveCount(4);
  });

  test("Should present survey items when fetch is successful", async ({ page, baseURL }) => {
    await HTTP.mockSuccessfulRequest({
      page,
      url: apiURL,
      response: surveys,
    });

    await page.goto(`${baseURL}/`, { waitUntil: "load" });

    const surveyItems = page.getByTestId("survey-item");

    await expect(surveyItems).toHaveCount(2);

    const firstItem = surveyItems.first();
    expect(firstItem.getByTestId("check-icon")).toBeVisible();
    expect(firstItem.getByTestId("question")).toHaveText("Question 1");
    expect(firstItem.getByTestId("day")).toHaveText("16");
    expect(firstItem.getByTestId("month")).toHaveText("May");
    expect(firstItem.getByTestId("year")).toHaveText("2026");

    const secondItem = surveyItems.nth(1);
    expect(secondItem.getByTestId("question-mark-icon")).toBeVisible();
    expect(secondItem.getByTestId("question")).toHaveText("Question 2");
    expect(secondItem.getByTestId("day")).toHaveText("15");
    expect(secondItem.getByTestId("month")).toHaveText("Mar");
    expect(secondItem.getByTestId("year")).toHaveText("2024");

  });
});