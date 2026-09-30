import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";

test.describe("Private Routes", () => {

  test("Should logout/redirect to login when attempt to access private route (SurveyList page) without token", async ({ page, baseURL }) => {
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForURL("**/login");
    expect(page.url()).toEqual(`${baseURL}/login`);
  });

  test("Should remain on private route (SurveyList page) when token is provided", async ({ page, baseURL }) => {
    const account = JSON.stringify(mockAccountModel());

    await page.addInitScript((account) => {
      localStorage.setItem("account", account);
    }, account);

    await page.goto("/");
    await page.waitForURL("**/");
    expect(page.url()).toEqual(`${baseURL}/`);
  });

  test("Should logout/redirect to login when attempt to access private route (SurveyResult page) without token", async ({ page, baseURL }) => {
    await page.goto("/surveys/any_id", { waitUntil: "commit" });
    await page.waitForURL("**/login");
    expect(page.url()).toEqual(`${baseURL}/login`);
  });

  test("Should remain on private route (SurveyResult page) when token is provided", async ({ page, baseURL }) => {
    const account = JSON.stringify(mockAccountModel());

    await page.addInitScript((account) => {
      localStorage.setItem("account", account);
    }, account);

    await page.goto("/surveys/any_id");
    await page.waitForURL("**/surveys/any_id");
    expect(page.url()).toEqual(`${baseURL}/surveys/any_id`);
  });
});