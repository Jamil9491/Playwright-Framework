import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { UIOps } from "@/Framework/controls/appWrapper";
export class LoginTFSPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly profileMenu: Locator;
  public async isPageLoaded(): Promise<boolean> {
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
    return true;
  }

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId("login-username");
    this.passwordInput = page.getByTestId("login-password");
    this.signInButton = page.getByTestId("login-submit");
    this.profileMenu = page.getByTestId("header-profile-menu");
  }

  public async open(): Promise<void> {
    // After a logout the app is usually already on the login page, so don't reload it
    if (this.appWrapper.isAtUrl(this.config.BASE_URL)) {
      this.logger.info(`Already on the login page: ${this.page.url()}`);
    } else {
      await this.appWrapper.navigateTo(this.config.BASE_URL);
    }
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
  }

  public async enterUsername(username: string): Promise<void> {
    await this.appWrapper.executeStep(this.usernameInput, UIOps.Set, username);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.appWrapper.executeStep(this.passwordInput, UIOps.Set, password);
  }

  public async submit(): Promise<void> {
    await this.appWrapper.executeStep(this.signInButton, UIOps.Set);
  }
  public async verifyUserLoggedIn(): Promise<void> {
    await expect(this.profileMenu).toBeVisible({ timeout: 15000 });
  }
}
