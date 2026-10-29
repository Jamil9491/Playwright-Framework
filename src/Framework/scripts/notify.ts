/**
 * Post-run notification
 * Generates the Allure report and emails it when EMAIL_NOTIFICATION=true.
 * Shared by runTests.ts (after a run) and sendReportEmail.ts (manual send).
 */

import { config } from "../config/config";
import Logger from "../utils/logger";
import { emailService } from "../Report/emailService";
import { generateAllureReport, getRunSummary } from "../Report/reportService";

const REPORT_DIR = "allure-report";

/**
 * @param force - Send even if EMAIL_NOTIFICATION / EMAIL_SEND_ON say otherwise (manual send).
 * @returns true if the email was sent (or saved, in dry-run mode).
 */
export async function notify(force = false): Promise<boolean> {
  if (!config.EMAIL_NOTIFICATION && !force) {
    Logger.info("Email notification is disabled (EMAIL_NOTIFICATION=false).");
    return false;
  }

  const summary = getRunSummary();
  Logger.info(
    `Run summary: ${summary.status} - ${summary.passed}/${summary.total} passed, ${summary.failed} failed, ${summary.broken} broken`,
  );

  if (!force && !emailService.shouldSend(summary)) {
    Logger.info(
      `Skipping email: EMAIL_SEND_ON=${config.EMAIL_SEND_ON} and run ${summary.status}.`,
    );
    return false;
  }

  // Single-file report: the same index.html is opened locally and attached to the email
  const reportFile = generateAllureReport(REPORT_DIR, true);
  await emailService.sendReportEmail(summary, reportFile);
  return true;
}
