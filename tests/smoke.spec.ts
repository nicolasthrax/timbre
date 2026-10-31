import { expect, test } from "@playwright/test";
import { SOURCE_URL_PATTERN, mockMicrophone, seed } from "./helpers";

test("landing renders and CTA navigates to sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "How much of your voice is out there?" })).toBeVisible();
  await expect(page).toHaveTitle("Timbre AI — How much of your voice is out there?");
  await page.getByRole("link", { name: /Scan my voice — free/ }).first().click();
  await expect(page).toHaveURL(/\/signin$/);
  await expect(page.getByRole("heading", { name: "Sign in to Timbre" })).toBeVisible();
});

test("happy path: sign in → consent → enrol → accounts → scan → redacted free results", async ({ page }) => {
  await mockMicrophone(page);
  await page.goto("/signin");
  await page.getByLabel("Email").fill("kai@example.com");
  await page.getByRole("button", { name: "Email me a sign-in link" }).click();

  await expect(page).toHaveURL(/\/onboarding\/consent$/);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Agree and continue" }).click();

  await expect(page).toHaveURL(/\/onboarding\/enrol$/);
  await expect(page.getByRole("list", { name: "Phrases to read aloud" }).getByRole("listitem")).toHaveCount(3);
  await page.getByRole("button", { name: "Start recording" }).click();
  await expect(page.getByText("Recording", { exact: true })).toBeVisible();
  const submit = page.getByRole("button", { name: "Create voiceprint" });
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  await expect(page).toHaveURL(/\/onboarding\/accounts$/);
  await page.getByLabel(/Instagram/).fill("@kai.eats.hk");
  await page.getByLabel(/Full name/).fill("Kai Chan");
  await page.getByRole("button", { name: "Start my scan" }).click();

  await expect(page).toHaveURL(/\/scan\//);
  await expect(page.getByText(/Collecting public videos|Matching your voice|Calculating exposure/).first()).toBeVisible();
  await expect(page).toHaveURL(/\/results$/, { timeout: 40_000 });

  await expect(page.getByTestId("minutes-found")).toContainText("47");
  await expect(page.getByTestId("source-list").getByRole("listitem")).toHaveCount(12);
  const html = await page.content();
  expect(html).not.toMatch(SOURCE_URL_PATTERN);
});

test("upgrade → dashboard shows source URLs → open a source → mark as fixed", async ({ page }) => {
  await seed(page, "free");
  await page.goto("/results");
  await expect(page.getByTestId("minutes-found")).toBeVisible();
  expect(await page.content()).not.toMatch(SOURCE_URL_PATTERN);

  await page.getByRole("button", { name: "See all sources" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByText("Monthly").click();
  await dialog.getByRole("button", { name: "Upgrade" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  const list = page.getByTestId("source-list");
  await expect(list).toContainText(SOURCE_URL_PATTERN);

  await list.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/sources\//);
  await expect(page.getByTestId("source-url")).toHaveText(SOURCE_URL_PATTERN);
  await page.getByRole("button", { name: "Mark as fixed" }).click();
  await expect(page.getByText("Marked as fixed")).toBeVisible();
});

test("clone test is locked for free users and unlocked for Pro", async ({ page }) => {
  await mockMicrophone(page);
  await seed(page, "free");
  await page.goto("/clone-test");
  await expect(page.getByTestId("clone-test-locked")).toBeVisible();
  await expect(page.getByTestId("clone-test-unlocked")).toHaveCount(0);

  await seed(page, "pro");
  await page.goto("/clone-test");
  await expect(page.getByTestId("clone-test-unlocked")).toBeVisible();
  await page.getByRole("button", { name: "Start clone test" }).click();
  await page.getByRole("button", { name: "Start recording" }).click();
  const generate = page.getByRole("button", { name: "Generate clone" });
  await expect(generate).toBeEnabled({ timeout: 15_000 });
  await generate.click();

  await expect(page.getByRole("heading", { name: "Real", exact: true })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Clone", exact: true })).toBeVisible();
  await expect(page.getByText("Watermarked", { exact: true })).toBeVisible();
  await expect(page.locator("audio")).toHaveCount(2);
  for (const audio of await page.locator("audio").all()) {
    await expect(audio).toHaveAttribute("controlslist", /nodownload/);
    await expect(audio).not.toHaveAttribute("controls", /.*/);
  }
  await expect(page.locator('a[href$=".wav"]')).toHaveCount(0);
});

test("delete my data returns to the landing page and clears state", async ({ page }) => {
  await seed(page, "pro");
  await page.goto("/settings");
  await page.getByRole("button", { name: "Delete…" }).click();
  const confirm = page.getByRole("button", { name: "Permanently delete everything" });
  await expect(confirm).toBeDisabled();
  await page.getByLabel(/Type DELETE to confirm/).fill("DELETE");
  await confirm.click();

  await expect(page).toHaveURL(/\/\?deleted=1$/);
  await expect(page.getByText("Your data has been deleted")).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem("timbre:mock:v1") ?? "{}"));
  expect(stored.user).toBeNull();
  expect(stored.sources).toEqual([]);

  await page.goto("/results");
  await expect(page).toHaveURL(/\/signin$/);
});
