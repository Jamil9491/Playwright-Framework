/**
 * Email Service
 * Sends the test report email over SMTP using 'nodemailer'.
 * Subject, body template, recipients and SMTP settings all come from .env (see config.ts).
 *
 * With EMAIL_DRY_RUN=true nothing is sent; the email is saved as an .eml file
 * under email-output/ so it can be opened in Outlook / a mail client to preview.
 */

import fs from "fs";
import os from "os";
import path from "path";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { config } from "../config/config";
import Logger from "../utils/logger";
import { RunSummary, formatDuration } from "./reportService";

const DRY_RUN_DIR = path.join(process.cwd(), "email-output");

const STATUS_COLORS: Record<RunSummary["status"], string> = {
  PASSED: "#1f7a3a",
  FAILED: "#b42318",
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Replaces {{key}} placeholders. Unknown placeholders are left as-is so typos are visible. */
export function renderTemplate(
  template: string,
  values: Record<string, string>,
  escape = false,
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in values ? (escape ? escapeHtml(values[key]) : values[key]) : match,
  );
}

class EmailService {
  private logger = Logger;

  /** Decides whether a run with this result should trigger an email, based on EMAIL_SEND_ON. */
  public shouldSend(summary: RunSummary): boolean {
    if (!config.EMAIL_NOTIFICATION) return false;
    switch (config.EMAIL_SEND_ON) {
      case "failure":
        return summary.status === "FAILED";
      case "success":
        return summary.status === "PASSED";
      default:
        return true;
    }
  }

  private validateConfig(): void {
    const missing: string[] = [];
    if (!config.EMAIL_TO.length) missing.push("EMAIL_TO");
    if (!config.EMAIL_FROM) missing.push("EMAIL_FROM");
    if (!config.EMAIL_DRY_RUN) {
      if (!config.SMTP_HOST) missing.push("SMTP_HOST");
      if (!config.SMTP_USER) missing.push("SMTP_USER");
      if (!config.SMTP_PASSWORD) missing.push("SMTP_PASSWORD");
    }
    if (missing.length) {
      throw new Error(
        `Email is not configured. Missing in .env: ${missing.join(", ")}`,
      );
    }
  }

  private createTransport(): Transporter {
    if (config.EMAIL_DRY_RUN) {
      return nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
        newline: "windows",
      });
    }
    return nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD },
    });
  }

  /** Values available to the subject and body templates. */
  private buildPlaceholders(summary: RunSummary): Record<string, string> {
    return {
      projectName: config.EMAIL_PROJECT_NAME,
      status: summary.status,
      statusColor: STATUS_COLORS[summary.status],
      total: String(summary.total),
      passed: String(summary.passed),
      failed: String(summary.failed),
      broken: String(summary.broken),
      skipped: String(summary.skipped),
      passRate: summary.passRate,
      duration: formatDuration(summary.durationMs),
      env: config.ENV,
      baseUrl: config.BASE_URL,
      browser: config.BROWSER,
      tags: process.env.CUCUMBER_TAGS || "All",
      // Set by runSuite.ts: "<workbook> › <sheet>"
      suite: process.env.TEST_SUITE || "-",
      date: new Date().toLocaleString(),
      host: os.hostname(),
    };
  }

  private buildFailedTestsTable(summary: RunSummary): string {
    if (!summary.failedTests.length) return "";

    const rows = summary.failedTests
      .map(
        (test) => `
                <tr>
                    <td style="padding:6px;border-top:1px solid #e4e7eb;">${escapeHtml(test.feature)}</td>
                    <td style="padding:6px;border-top:1px solid #e4e7eb;">${escapeHtml(test.name)}</td>
                    <td style="padding:6px;border-top:1px solid #e4e7eb;color:#b42318;">${escapeHtml(test.status)}</td>
                    <td style="padding:6px;border-top:1px solid #e4e7eb;color:#616e7c;">${escapeHtml(test.message)}</td>
                </tr>`,
      )
      .join("");

    return `
            <div style="font-size:14px;font-weight:600;margin-bottom:6px;">Failed tests</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;border-collapse:collapse;">
                <tr style="text-align:left;color:#616e7c;">
                    <th style="padding:6px;">Feature</th><th style="padding:6px;">Scenario</th>
                    <th style="padding:6px;">Status</th><th style="padding:6px;">Error</th>
                </tr>${rows}
            </table>`;
  }

  /**
   * Builds and sends the report email.
   * @param summary - Run summary from reportService.getRunSummary().
   * @param reportFile - Path to the single-file Allure report to attach (optional).
   */
  public async sendReportEmail(
    summary: RunSummary,
    reportFile?: string,
  ): Promise<void> {
    this.validateConfig();

    const templatePath = path.resolve(
      process.cwd(),
      config.EMAIL_TEMPLATE_PATH,
    );
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    const placeholders = this.buildPlaceholders(summary);
    const attachments: SendMailOptions["attachments"] = [];
    let reportNote = config.EMAIL_ATTACH_REPORT
      ? "The Allure report could not be attached because it was not found."
      : "The Allure report is not attached (EMAIL_ATTACH_REPORT=false).";

    if (config.EMAIL_ATTACH_REPORT && reportFile && fs.existsSync(reportFile)) {
      const sizeMb = fs.statSync(reportFile).size / (1024 * 1024);
      if (sizeMb <= config.EMAIL_MAX_ATTACHMENT_MB) {
        const stamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-");
        attachments.push({
          filename: `allure-report-${stamp}.html`,
          path: reportFile,
          contentType: "text/html",
        });
        reportNote =
          "Download the attached HTML file and open it in a browser to view the full Allure report.";
      } else {
        reportNote = `The Allure report (${sizeMb.toFixed(1)} MB) exceeds the ${config.EMAIL_MAX_ATTACHMENT_MB} MB attachment limit and was not attached.`;
        this.logger.warn(reportNote);
      }
    }

    // Body values are HTML-escaped; the two pre-built HTML fragments are inserted afterwards as-is
    const template = fs
      .readFileSync(templatePath, "utf-8")
      .replace(/<!--[\s\S]*?-->/g, "");
    const html = renderTemplate(renderTemplate(template, placeholders, true), {
      failedTestsTable: this.buildFailedTestsTable(summary),
      reportNote: escapeHtml(reportNote),
    });

    const message: SendMailOptions = {
      from: config.EMAIL_FROM,
      to: config.EMAIL_TO,
      cc: config.EMAIL_CC.length ? config.EMAIL_CC : undefined,
      bcc: config.EMAIL_BCC.length ? config.EMAIL_BCC : undefined,
      subject: renderTemplate(config.EMAIL_SUBJECT, placeholders),
      html,
      attachments,
    };

    const info = await this.createTransport().sendMail(message);

    if (config.EMAIL_DRY_RUN) {
      fs.mkdirSync(DRY_RUN_DIR, { recursive: true });
      const emlFile = path.join(DRY_RUN_DIR, `report-email-${Date.now()}.eml`);
      fs.writeFileSync(emlFile, info.message as Buffer);
      this.logger.info(
        `📧 [DRY RUN] Email not sent. Saved preview to ${emlFile}`,
      );
      return;
    }

    this.logger.info(
      `📧 Report email sent to ${config.EMAIL_TO.join(", ")} (messageId: ${info.messageId})`,
    );
  }
}

// Export a singleton instance
export const emailService = new EmailService();
