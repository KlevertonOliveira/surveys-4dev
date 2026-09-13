import { test, expect } from "@playwright/test";

test.describe("Private Routes", () => {
  test("Should logout/redirect to login when attempt to access private route without token",
    async ({ page, baseURL }) => {
      await page.goto('/', { waitUntil: "commit" });
      await page.waitForURL('**/login');
      expect(page.url()).toEqual(`${baseURL}/login`);
    });
});