import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { UIOps } from "@/Framework/controls/appWrapper";

export class LogutTFSPage extends BasePage {
  private readonly profileButton: Locator;
  private readonly signOutButton: Locator;
  private readonly usernameInput: Locator;

  // public async isPageLoaded(): Promise<boolean> {
  //   await expect(this.profileButton).toBeVisible({ timeout: 15000 });
  //   return true;
  // }

  constructor(page: Page) {
    super(page);
    this.profileButton = page.getByTestId("header-profile-menu");
    this.signOutButton = page.getByTestId("header-sign-out");
    this.usernameInput = page.getByTestId("login-username");
  }

  // public async assertLoLogLogVisible(): Promise<void> {
  //   await expect(this.loLogLogButton).toBeVisible();
  // }

  public async clickProfileButton(): Promise<void> {
    await this.appWrapper.executeStep(this.profileButton, UIOps.Set);
  }

  public async logout(): Promise<void> {
    await this.appWrapper.executeStep(this.signOutButton, UIOps.Set);
  }

  public async assertUsernameVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
  }
}

