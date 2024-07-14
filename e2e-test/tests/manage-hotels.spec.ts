import path from "path";
import test, { expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Sign In Successfully!")).toBeVisible();
});

test("Should Allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);
  await page.locator("[name=name]").fill("Test Hotel Mode");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill("Test Description");
  await page.locator('[name="pricePerNight"]').fill("2000");
  await page.selectOption('select[name="starRating"]', "3");
  await page.getByText("Budget").click();
  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();
  await page.locator("[name=adultCount]").fill("2");
  await page.locator("[name=childCount]").fill("1");

  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.jpg"),
    path.join(__dirname, "files", "2.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("Should Display Hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText("Test Hotel Mode")).toBeVisible();
  await expect(page.getByText("Test Description")).toBeVisible();
  await expect(page.getByText("Test City, Test Country")).toBeVisible();
  await expect(page.getByText("Budget")).toBeVisible();
  await expect(page.getByText("$2000 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 1 children")).toBeVisible();
  await expect(page.getByText("3 Star Rating")).toBeVisible();

  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Details" })).toBeVisible();
});
