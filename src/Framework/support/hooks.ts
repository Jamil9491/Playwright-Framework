/**
 * Cucumber Hooks
 * Provides setup and teardown functionality for test scenarios,
 * focusing on Playwright browser management.
 * Allure reporting is now handled via the new 'allure-cucumberjs/reporter' format.
 */

import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { ICustomWorld } from "./world";
import Logger from "../utils/logger";
import { ScreenshotManager } from "../utils/ScreenshotManager";
import { POManager } from "@/tests/pages/POManager";
import { GlobalVariables } from "../globalVariables";
import { posgreSQLService } from "../dataSourceAction/posgreSQLService";
import { config } from "../config/config";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { getSuiteEntry, workflowKey } from "../suite/suiteContext";
// Max time per step/hook (Cucumber defaults to 5s, too short with SLOW_MO or slow pages).
// Individual steps can still override it with { timeout: ... }.
setDefaultTimeout(config.STEP_TIMEOUT);

// Global setup before all scenarios
BeforeAll(async function () {
  Logger.info("🚀 Starting test execution...");
  // Once per run (each --parallel worker logs it once); the World is rebuilt for every scenario
  Logger.logConfig();
  // Add any global setup here (e.g., API server start)
  Logger.info("✅ Test environment initialized");
});

// Excel suite runs (runSuite.ts): scenarios of the same workflow continue in one browser
// session and keep their global variables, like one long test. A new workflow starts fresh.
let suiteSession:
  | { workflow: string; browser?: Browser; context?: BrowserContext; page?: Page }
  | undefined;
const failedWorkflows = new Set<string>();

async function closeSuiteSession(): Promise<void> {
  await suiteSession?.browser?.close().catch(() => undefined);
  suiteSession = undefined;
}

// Setup before each scenario
// Launching a browser (and maximizing Firefox/WebKit) can take longer than Cucumber's 5s default
Before({ timeout: 60000 }, async function (this: ICustomWorld, scenario) {
  this.logger.info(`🎬 Starting scenario: ${scenario.pickle.name}`);

  // Database-only scenarios don't need a browser
  const needsBrowser = !scenario.pickle.tags.some((tag) => tag.name === "@db");
  const suiteEntry = getSuiteEntry(scenario.pickle.uri);

  if (!suiteEntry) {
    // Reset shared state so values don't leak between scenarios
    GlobalVariables.clear();
    if (!needsBrowser) return;

    // Initialize browser for the scenario
    await this.initBrowser();
    this.logger.info(`🌐 Browser initialized: ${this.config.BROWSER}`);
    this.POManager = new POManager(this.page);
    return;
  }

  const workflow = workflowKey(suiteEntry);
  if (config.SUITE_STOP_WORKFLOW_ON_FAILURE && failedWorkflows.has(workflow)) {
    this.logger.warn(
      `⏭️ Skipped: an earlier scenario of workflow ${suiteEntry.seqId} failed (SUITE_STOP_WORKFLOW_ON_FAILURE=true)`,
    );
    return "skipped";
  }

  if (suiteSession?.workflow !== workflow) {
    await closeSuiteSession();
    GlobalVariables.clear();
    suiteSession = { workflow };
  }
  GlobalVariables.Seq_Id = suiteEntry.seqId;
  GlobalVariables.WorkFlow_Desc = suiteEntry.workflow;
  GlobalVariables.Iteration = suiteEntry.iteration;

  if (!needsBrowser) return;

  if (suiteSession.browser?.isConnected() && suiteSession.page && !suiteSession.page.isClosed()) {
    this.browser = suiteSession.browser;
    this.context = suiteSession.context!;
    this.page = suiteSession.page;
    this.logger.info(`🌐 Continuing workflow ${suiteEntry.seqId} in the same browser`);
  } else {
    await suiteSession.browser?.close().catch(() => undefined);
    await this.initBrowser();
    Object.assign(suiteSession, { browser: this.browser, context: this.context, page: this.page });
    this.logger.info(`🌐 Browser initialized: ${this.config.BROWSER}`);
  }
  this.POManager = new POManager(this.page);
});

// Cleanup after each scenario
After(async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await ScreenshotManager.capture(
      this,
      `FAILED-${scenario.pickle.name.replace(/s+/g, "_")}`,
    );
  }
  const scenarioName = scenario.pickle.name;
  const scenarioStatus = scenario.result?.status;

  this.logger.info(
    `🏁 Scenario completed: ${scenarioName} - Status: ${scenarioStatus}`,
  );

  const suiteEntry = getSuiteEntry(scenario.pickle.uri);
  if (suiteEntry) {
    // Keep the browser for the next scenario of the workflow; it's closed when the workflow changes
    if (scenarioStatus === Status.FAILED) {
      failedWorkflows.add(workflowKey(suiteEntry));
    }
    return;
  }

  // Close browser
  await this.closeBrowser();
  this.logger.info("🔒 Browser closed");
});

// Global cleanup after all scenarios
AfterAll(async function () {
  Logger.info("🏆 Test execution completed");

  // Close the browser of the last suite workflow
  await closeSuiteSession();

  // Close PostgreSQL connections (no-op if the database was never used)
  await posgreSQLService.close();
  // Add any global cleanup here (e.g., API server stop)
});
