import { expect, Locator, Page } from "@playwright/test";
import BasePage, { UIOps } from "./basePage";

export class DarazHomePage extends BasePage {
  readonly loginLink: Locator;
  readonly accountMenu: Locator;
  readonly logoutLink: Locator;
  private readonly PAGE_URL = "https://www.daraz.pk/";

  async isPageLoaded(): Promise<boolean> {
    await expect(this.loginLink).toBeVisible({ timeout: 15000 });
    return true;
  }

  constructor(page: Page) {
    super(page);
    this.loginLink = page.getByRole("link", { name: "Login", exact: true });
    this.accountMenu = page.locator("#myAccountTrigger");
    this.logoutLink = page.locator("#account-popup-logout");
  }

  async open(): Promise<void> {
    await this.navigateTo(this.PAGE_URL);
    await expect(this.loginLink).toBeVisible({ timeout: 15000 });
  }

  async openLogin(): Promise<void> {
    debugger;
    // await this.loginLink.click();
    await this.executeStep(this.loginLink, UIOps.Click);
    
  }

  async assertLoggedIn(): Promise<void> {
    await expect(
      this.accountMenu,
      "Expected a signed-in Daraz account. Check credentials and any CAPTCHA/OTP challenge.",
    ).toBeVisible({ timeout: 30000 });
    await expect(this.accountMenu).toHaveText(/\S/);
    await expect(this.loginLink).toBeHidden();
    await this.accountMenu.hover();
    await expect(this.logoutLink).toBeVisible();
  }
}

export default DarazHomePage;
