import { expect, test, type Page } from "@playwright/test";
import { mockMicrophone, seed } from "./helpers";

// Captures every main screen into screenshots/<project>/ for visual review.
// Not part of the smoke suite's assertions; run with `npm run screenshots`.

async function shot(page: Page, name: string, fullPage = true) {
  const project = test.info().project.name;
  await page.waitForTimeout(400);
  await page.screenshot({ path: `screenshots/${project}/${name}.png`, fullPage });
}

test("marketing", async ({ page }) => {
  await page.goto("/");
  await shot(page, "01-landing");
  await page.goto("/privacy");
  await shot(page, "02-privacy", false);
  await page.goto("/terms");
  await shot(page, "03-terms", false);
  await page.goto("/does-not-exist");
  await shot(page, "04-not-found", false);
});

test("onboarding", async ({ page }) => {
  await mockMicrophone(page);
  await page.goto("/signin");
  await shot(page, "05-signin", false);
  await page.getByLabel("Email").fill("kai@example.com");
  await page.getByRole("button", { name: "Email me a sign-in link" }).click();
  await expect(page).toHaveURL(/consent/);
  await page.getByRole("checkbox").check();
  await shot(page, "06-consent");
  await page.getByRole("button", { name: "Agree and continue" }).click();
  await expect(page).toHaveURL(/enrol/);
  await shot(page, "07-enrol-ready");
  await page.getByRole("button", { name: "Start recording" }).click();
  await page.waitForTimeout(4000);
  await shot(page, "08-enrol-recording");
  await expect(page.getByRole("button", { name: "Create voiceprint" })).toBeEnabled({ timeout: 30_000 });
  await page.getByRole("button", { name: "Create voiceprint" }).click();
  await expect(page).toHaveURL(/accounts/);
  await page.getByLabel(/Instagram/).fill("kai eats");
  await page.getByRole("button", { name: "Start my scan" }).click();
  await shot(page, "09-accounts-validation");
  await page.getByLabel(/Instagram/).fill("kai.eats.hk");
  await page.getByRole("button", { name: "Start my scan" }).click();
  await expect(page).toHaveURL(/scan/);
  await page.waitForTimeout(2500);
  await shot(page, "10-scan-progress", false);
});

test("app screens", async ({ page }) => {
  await mockMicrophone(page);
  await seed(page);
  await page.goto("/dashboard");
  await expect(page.getByTestId("source-list")).toBeVisible();
  await shot(page, "14-dashboard");
  await page.getByTestId("source-list").getByRole("link").filter({ hasText: "Posted by you" }).first().click();
  await expect(page.getByTestId("source-url")).toBeVisible();
  await shot(page, "15-source-self");
  await page.goto("/dashboard");
  await page.getByTestId("source-list").getByRole("link").filter({ hasText: "Posted by someone else" }).first().click();
  await expect(page.getByTestId("source-url")).toBeVisible();
  await shot(page, "16-source-other");
  await page.goto("/clone-test");
  await shot(page, "17-clone-test-intro");
  await page.getByRole("button", { name: "Start clone test" }).click();
  await page.getByRole("button", { name: "Start recording" }).click();
  await expect(page.getByRole("button", { name: "Generate clone" })).toBeEnabled({ timeout: 15_000 });
  await page.getByRole("button", { name: "Generate clone" }).click();
  await expect(page.getByRole("heading", { name: "Real", exact: true })).toBeVisible({ timeout: 15_000 });
  await shot(page, "18-clone-test-result");
  await page.goto("/settings");
  await page.getByRole("button", { name: "Delete…" }).click();
  await shot(page, "19-settings");
});

test("states", async ({ page }) => {
  await page.goto("/dev/states?scenario=none");
  await page.getByRole("button", { name: "Seed demo account" }).click();
  await page.goto("/dashboard");
  await expect(page.getByTestId("minutes-found")).toBeVisible();
  await shot(page, "21-results-none");

  await page.goto("/dev/states?scenario=partial");
  await page.getByRole("button", { name: "Seed demo account" }).click();
  await page.goto("/dashboard");
  await expect(page.getByTestId("minutes-found")).toBeVisible();
  await shot(page, "22-results-partial");

  await page.goto("/dev/states");
  await shot(page, "23-dev-states");
  await page.goto("/?deleted=1");
  await shot(page, "24-deleted", false);
  await page.goto("/dev/states");
  await page.getByRole("button", { name: "Trigger error page" }).click();
  await expect(page.getByText("Something went wrong")).toBeVisible();
  await shot(page, "25-error", false);
});
