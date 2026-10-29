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

}


// export default BasePage;
