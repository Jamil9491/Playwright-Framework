/**
 * Cucumber Hooks
 * Provides setup and teardown functionality for test scenarios,
 * focusing on Playwright browser management.
 * Allure reporting is now handled via the new 'allure-cucumberjs/reporter' format.
 */

import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { ICustomWorld } from "./world";
import Logger from "../utils/logger";
import { ScreenshotManager } from "../utils/ScreenshotManager";
import { dataService } from "../utils/dataService"; // Import the data service
import * as path from "path";
import { POManager } from "@/pages/POManager";
import { GlobalVariables } from "../utils/globalVariables";
import { dbService } from "../utils/dbService";
import { config } from "../config/config";
// Max time per step/hook (Cucumber defaults to 5s, too short with SLOW_MO or slow pages).
// Individual steps can still override it with { timeout: ... }.
setDefaultTimeout(config.STEP_TIMEOUT);

// Global setup before all scenarios

// Excel test data location comes from TEST_DATA_PATH in .env (relative to the project root)
const EXCEL_FILE_NAME = config.TEST_DATA_PATH;
const EXCEL_FILE_PATH = path.join(process.cwd(), EXCEL_FILE_NAME);
BeforeAll(async function () {
  // Load data from the multi-sheet Excel file
  try {
    dataService.loadData(EXCEL_FILE_PATH);
  } catch (error) {
    Logger.error(
      `FATAL: Could not load test data from ${EXCEL_FILE_NAME}. Test execution aborted.`,
    );
    // In a real scenario, you might want to exit the process here
    // process.exit(1);
  }

  Logger.info("🚀 Starting test execution...");
  // Add any global setup here (e.g., API server start)
  Logger.info("✅ Test environment initialized");
});

// Setup before each scenario
// Launching a browser (and maximizing Firefox/WebKit) can take longer than Cucumber's 5s default
Before({ timeout: 60000 }, async function (this: ICustomWorld, scenario) {
  this.logger.info(`🎬 Starting scenario: ${scenario.pickle.name}`);

  // Reset shared state so values don't leak between scenarios
  GlobalVariables.clear();

  // Database-only scenarios don't need a browser
  if (scenario.pickle.tags.some((tag) => tag.name === "@db")) {
    return;
  }

  // Initialize browser for the scenario
  await this.initBrowser();

  this.logger.info(`🌐 Browser initialized: ${this.config.BROWSER}`);
  this.POManager = new POManager(this.page);
});

// Cleanup after each scenario
After(async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await ScreenshotManager.capture(
      this,
      `FAILED-${scenario.pickle.name.replace(/\s+/g, "_")}`,
    );
  }
  const scenarioName = scenario.pickle.name;
  const scenarioStatus = scenario.result?.status;

  this.logger.info(
    `🏁 Scenario completed: ${scenarioName} - Status: ${scenarioStatus}`,
  );

  // Close browser
  await this.closeBrowser();
  this.logger.info("🔒 Browser closed");
});

// Global cleanup after all scenarios
AfterAll(async function () {
  Logger.info("🏆 Test execution completed");

  // Close PostgreSQL connections (no-op if the database was never used)
  await dbService.close();
  // Add any global cleanup here (e.g., API server stop)
});
