import { expect, test } from "@playwright/test";

// Captures the three hero directions from DESIGN.md into screenshots/<project>/.
for (const variant of ["a", "b", "c"] as const) {
  test(`hero ${variant}`, async ({ page }) => {
    await page.goto(`/hero-lab/${variant}`);
    await expect(page.getByRole("heading", { level: 1, name: "How much of your voice is out there?" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `screenshots/${test.info().project.name}/hero-${variant}.png`, fullPage: true });
  });
}
