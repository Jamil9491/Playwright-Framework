/**
 * Cucumber World Context
 * Extends the base World class to provide shared context and utilities
 * for all step definitions.
 */

import { World, setWorldConstructor } from "@cucumber/cucumber";
import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  firefox,
  webkit,
} from "@playwright/test";
import { config } from "../config/config";
import Logger from "../utils/logger";
import { maximizeWindow } from "../utils/windowManager";
import path from "path";
import { POManager } from "../../pages/POManager";

/**
 * Defines the shared context available in all Cucumber steps.
 */
export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  POManager: POManager; // You can replace 'any' with the actual type if you have a POManager class
  config: typeof config;
  logger: typeof Logger;
  testData: { [key: string]: any };
  attach: World["attach"];
  // Custom methods
  initBrowser: () => Promise<void>;
  closeBrowser: () => Promise<void>;
  takeScreenshot: (scenarioName: string) => Promise<Buffer | undefined>;
}

/**
 * Custom World class that manages the Playwright browser instance.
 */
export class CustomWorld extends World implements ICustomWorld {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public POManager!: POManager;
  public config = config;
  public logger = Logger;
  public testData: { [key: string]: any } = {};

  constructor(options: any) {
    super(options);
    this.logger.logConfig();
    this.POManager = new POManager(this.page);
  }

  /**
   * Initializes the Playwright browser and page.
   */
  public async initBrowser(): Promise<void> {
    this.logger.info(`Initializing ${this.config.BROWSER} browser...`);

    const browserType = {
      chromium,
      firefox,
      webkit,
    }[this.config.BROWSER];

    if (!browserType) {
      throw new Error(`Unsupported browser type: ${this.config.BROWSER}`);
    }

    // Maximizing needs a real window, so it only applies to headed runs
    const maximize = this.config.START_MAXIMIZED && !this.config.HEADLESS;
    if (this.config.START_MAXIMIZED && this.config.HEADLESS) {
      this.logger.warn("START_MAXIMIZED is ignored in headless mode; using VIEWPORT_WIDTH/VIEWPORT_HEIGHT.");
    }

    this.browser = await browserType.launch({
      headless: this.config.HEADLESS,
      slowMo: this.config.SLOW_MO,
      // Only Chromium supports --start-maximized; Firefox/WebKit are maximized after launch
      args: maximize && this.config.BROWSER === "chromium" ? ["--start-maximized"] : [],
    });

    this.context = await this.browser.newContext({
      // null = use the real window size instead of a fixed viewport
      viewport: maximize
        ? null
        : {
            width: this.config.VIEWPORT_WIDTH,
            height: this.config.VIEWPORT_HEIGHT,
          },
      baseURL: this.config.BASE_URL,
      ignoreHTTPSErrors: true,
      // Add other context options as needed (e.g., locale, timezone)
    });

    // Set default timeout for all operations
    this.context.setDefaultTimeout(this.config.TIMEOUT);

    this.page = await this.context.newPage();

    // Firefox/WebKit have no start-maximized flag, so maximize the OS window directly
    if (maximize && this.config.BROWSER !== "chromium") {
      await maximizeWindow(this.page);
    }

    this.logger.info(
      maximize
        ? "Browser and Page initialized successfully (maximized)."
        : `Browser and Page initialized successfully (${this.config.VIEWPORT_WIDTH}x${this.config.VIEWPORT_HEIGHT}).`,
    );
  }

  /**
   * Closes the Playwright browser.
   */
  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      this.logger.info("Closing browser...");
      await this.browser.close();
    }
  }

  /**
   * Takes a screenshot of the current page.
   */
  public async takeScreenshot(
    scenarioName: string,
  ): Promise<Buffer | undefined> {
    if (this.page) {
      // Note: The allure-cucumberjs reporter automatically handles screenshot attachments
      // if you use the standard Playwright methods within the steps.
      // This method is kept for manual attachment if needed.
      const screenshotPath = path.join(
        process.cwd(),
        this.config.ALLURE_RESULTS_DIR,
        `screenshot-${scenarioName.replace(/\s/g, "_")}-${Date.now()}.png`,
      );

      this.logger.debug(`Taking screenshot: ${screenshotPath}`);
      const buffer = await this.page.screenshot({ path: screenshotPath });
      return buffer;
    }
    return undefined;
  }
}

setWorldConstructor(CustomWorld);
