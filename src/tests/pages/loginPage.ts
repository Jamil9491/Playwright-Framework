import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./basePage";
import {UIOps} from "@/Framework/controls/appWrapper";
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  public async isPageLoaded(): Promise<boolean> {
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
    return true;
  }

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId("login-username");
    this.passwordInput = page.getByTestId("login-password");
    this.signInButton = page.getByTestId("login-submit");
  }

  public async open(): Promise<void> {
    await this.appWrapper.navigateTo(this.config.BASE_URL);
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
  }

  public async enterUsername(username: string): Promise<void> {
    // await this.executeStep(this.usernameInput, UIOps.Set, username);
    await this.appWrapper.executeStep(this.usernameInput, UIOps.Set, username);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.appWrapper.executeStep(this.passwordInput, UIOps.Set, password);
  }

  public async submit(): Promise<void> {
    await this.appWrapper.executeStep(this.signInButton, UIOps.Set);
  }
}

export default LoginPage;
