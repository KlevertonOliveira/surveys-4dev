import { mockAccountModel } from "@/domain/test";
import { test, expect } from "@playwright/test";

test.describe("Private Routes", () => {

  test("Should logout/redirect to login when attempt to access private route without token", async ({ page, baseURL }) => {
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForURL("**/login");
    expect(page.url()).toEqual(`${baseURL}/login`);
  });

  test("Should remain on private route ('/') when token is provided", async ({ page, baseURL }) => {
    const account = JSON.stringify(mockAccountModel());

    await page.addInitScript((account) => {
      localStorage.setItem("account", account);
    }, account);

    await page.goto("/");
    await page.waitForURL("**/");
    expect(page.url()).toEqual(`${baseURL}/`);
  });
});