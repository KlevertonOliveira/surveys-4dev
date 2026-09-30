 
import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";
import * as HTTP from "@/test/api-mocks/api-mocks";

const apiURL = "/surveys/any_id/results";

test.describe("SurveyResultPage", () => {
  test.beforeEach(async ({ page }) => {
    const account = JSON.stringify(mockAccountModel());

    await page.addInitScript((account) => {
      localStorage.setItem("account", account);
    }, account);
  });

  test("Should present error message on UnexpectedError", async ({ page, baseURL }) => {
    await HTTP.mockServerError(page, apiURL);
    await page.goto(`${baseURL}/surveys/any_id`, { waitUntil: "load" });

    const errorMessage = page.getByTestId("error-message");

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("Something went wrong. Try again later.");
  });
});