import { test, expect } from "@playwright/test";

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

test("Should show hotel search results", async ({ page }) => {
  await page.goto(`${UI_URL}`);

  await page.getByPlaceholder("Where are you going?").fill("test");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels Found in test")).toBeVisible();
  await expect(page.getByText("Hotel Mode").first()).toBeVisible();
});

test("Should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("test");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Hotel Mode").first().click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
});

test("Should Book Hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("test");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Hotel Mode").first().click();
  await page.getByRole("button", { name: "Book Now" }).click();

  await page.getByText("Total Cost: $4000.00");

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator("[placeholder:رقم البطاقة]")
    .fill("4242424242424242");
  await stripeFrame.locator("[placeholder:سنة / شهر]").fill("04/30");
  await stripeFrame.locator("[placeholder:CVC]").fill("242");
  await stripeFrame.locator("[placeholder:رقم المنطقة البريدي]").fill("24225");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible();
});
