import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";
import * as HTTP from "@/test/api-mocks/api-mocks";

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
});