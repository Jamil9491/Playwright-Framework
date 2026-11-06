/**
 * Base Page Class
 * Provides common functionality for all page objects.
 * Follows the Page Object Model (POM) pattern.
 */

import { Page, Locator, expect } from "@playwright/test";
import Logger from "../../Framework/utils/logger";
import { config } from "../../Framework/config/config";
import fs from "fs";
import path from "path";
import { AppWrapper } from "@/Framework/controls/appWrapper";
/**
 * Abstract base class for all page objects.
 * Contains common methods and properties that all pages should have.
 */
export abstract class BasePage {
  protected page: Page;
  protected appWrapper: AppWrapper;
  protected logger: typeof Logger;
  protected config: typeof config;
  private readonly defaultTimeout: number;

  constructor(page: Page) {
    this.page = page;
    this.appWrapper = new AppWrapper(this.page);
    this.logger = Logger;
    this.config = config;
    this.defaultTimeout = Number(process.env.TIMEOUT ?? 30000);
  }

  /**
   * Asserts the app is on the given screen, e.g. verifyUrl("/lc/find").
   * The path is resolved against BASE_URL's host, so it follows the environment in .env.
   * Query string, hash and a trailing slash are ignored. Waits up to TIMEOUT for a redirect.
   */
  public async verifyUrl(urlPath: string): Promise<void> {
    const expected = new URL(urlPath, this.config.BASE_URL);
    const expectedPath = expected.pathname.replace(/\/+$/, "");
    await expect(this.page, `Expected to be on ${expected.origin}${expectedPath}`).toHaveURL(
      (url) => url.origin === expected.origin && url.pathname.replace(/\/+$/, "") === expectedPath,
      { timeout: this.config.TIMEOUT },
    );
    this.logger.info(`On the expected screen: ${this.page.url()}`);
  }

  /**
   * Waits until the locator matches exactly `count` elements (default 1), e.g. a table
   * narrowing down to one row after a search/filter API call. Fails after TIMEOUT.
   */
  public async waitForCount(locator: Locator, count: number = 1): Promise<void> {
    await expect(locator).toHaveCount(count, { timeout: this.config.TIMEOUT });
  }

}


// export default BasePage;
