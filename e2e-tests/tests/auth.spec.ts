import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

//! Check login
test("shold allow user to sign in", async ({ page }) => {
  //go to home page
  await page.goto(UI_URL);

  //get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click(); //get the sign in button

  //check if sign in page comes
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible(); //check if sign in heading appears

  //after sign in page loads type in username password
  await page.locator("[name=email]").fill("gaurav@g.com"); //enter email
  await page.locator("[name=password]").fill("11111!"); //enter password

  //click log in
  await page.getByRole("button", { name: "Login" }).click(); //click login

  //check if user signed in by checking if links appear in header & toast appears
  await expect(page.getByText("Sign In Successful")).toBeVisible(); //check if toast appears
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible(); //check if My Booking link appears
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible(); //check if My Hotel link appears
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible(); //check if Sign Out button appears
});

//! Check registration
test("should allow user to register", async ({ page }) => {
  //* create random email id -
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;

  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test");
  await page.locator("[name=lastName]").fill("test");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("11111!");
  await page.locator("[name=confirmPassword]").fill("11111!");

  await page.getByRole("button", { name: "Create Account" }).click();

  //check if user signed in by checking if links appear in header & toast appears
  await expect(page.getByText("Registration Successful!")).toBeVisible(); //check if toast appears
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible(); //check if My Booking link appears
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible(); //check if My Hotel link appears
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible(); //check if Sign Out button appears
});
