/**
 * Report Service
 * Reads the raw Allure results into a run summary and generates the Allure 3 report.
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import Logger from "../utils/logger";
import { config } from "../config/config";

export type TestStatus = "passed" | "failed" | "broken" | "skipped" | "unknown";

export interface FailedTest {
  name: string;
  feature: string;
  status: TestStatus;
  message: string;
}

export interface RunSummary {
  total: number;
  passed: number;
  failed: number;
  broken: number;
  skipped: number;
  passRate: string;
  durationMs: number;
  status: "PASSED" | "FAILED";
  failedTests: FailedTest[];
}

interface AllureFixture {
  status?: TestStatus;
  statusDetails?: { message?: string };
}

/** Before/After hooks are stored in *-container.json and linked to results via `children`. */
interface AllureContainer {
  children?: string[];
  befores?: AllureFixture[];
  afters?: AllureFixture[];
}

interface AllureResult {
  uuid: string;
  name: string;
  historyId?: string;
  status?: TestStatus;
  start?: number;
  stop?: number;
  statusDetails?: { message?: string };
  labels?: { name: string; value: string }[];
}

const RESULTS_DIR = path.join(process.cwd(), config.ALLURE_RESULTS_DIR);

/**
 * Builds a summary from allure-results/*-result.json.
 * Retries of the same test (same historyId) count once, using the latest attempt.
 */
export function getRunSummary(resultsDir: string = RESULTS_DIR): RunSummary {
  if (!fs.existsSync(resultsDir)) {
    throw new Error(`Allure results directory not found: ${resultsDir}`);
  }

  const files = fs.readdirSync(resultsDir);
  const readJson = <T>(file: string): T =>
    JSON.parse(fs.readFileSync(path.join(resultsDir, file), "utf-8"));

  // A failing Before/After hook leaves the scenario "skipped"; the error lives on the hook
  const hookFailures = new Map<string, AllureFixture>();
  for (const file of files.filter((f) => f.endsWith("-container.json"))) {
    const container = readJson<AllureContainer>(file);
    const failedHook = [
      ...(container.befores ?? []),
      ...(container.afters ?? []),
    ].find((hook) => hook.status === "failed" || hook.status === "broken");
    if (failedHook) {
      for (const child of container.children ?? [])
        hookFailures.set(child, failedHook);
    }
  }

  const latestByTest = new Map<string, AllureResult>();
  for (const file of files.filter((f) => f.endsWith("-result.json"))) {
    const result = readJson<AllureResult>(file);
    const hookFailure = hookFailures.get(result.uuid);
    if (
      hookFailure &&
      result.status !== "failed" &&
      result.status !== "broken"
    ) {
      result.status = "broken";
      result.statusDetails = {
        message: `Hook failed: ${hookFailure.statusDetails?.message ?? ""}`,
      };
    }
    const key = result.historyId || result.name;
    const existing = latestByTest.get(key);
    if (!existing || (result.stop ?? 0) > (existing.stop ?? 0)) {
      latestByTest.set(key, result);
    }
  }

  const results = [...latestByTest.values()];
  const count = (status: TestStatus) =>
    results.filter((r) => r.status === status).length;
  const total = results.length;
  const passed = count("passed");
  const failed = count("failed");
  const broken = count("broken");

  const starts = results.map((r) => r.start ?? 0).filter(Boolean);
  const stops = results.map((r) => r.stop ?? 0).filter(Boolean);
  const durationMs =
    starts.length && stops.length
      ? Math.max(...stops) - Math.min(...starts)
      : 0;

  return {
    total,
    passed,
    failed,
    broken,
    skipped: count("skipped"),
    passRate: total ? ((passed / total) * 100).toFixed(1) : "0.0",
    durationMs,
    // A run where nothing passed (e.g. everything skipped) is not a pass
    status: failed + broken > 0 || passed === 0 ? "FAILED" : "PASSED",
    failedTests: results
      .filter((r) => r.status === "failed" || r.status === "broken")
      .map((r) => ({
        name: r.name,
        feature: r.labels?.find((l) => l.name === "feature")?.value ?? "",
        status: r.status as TestStatus,
        message: (r.statusDetails?.message ?? "").split("\n")[0],
      })),
  };
}

/**
 * Generates the Allure 3 report using allurerc.mjs.
 * @param outputDir - Where to write the report.
 * @param singleFile - true produces one self-contained index.html (used for email attachments).
 * @returns Path to the report's index.html.
 */
export function generateAllureReport(
  outputDir: string,
  singleFile = false,
): string {
  const absoluteOutput = path.resolve(process.cwd(), outputDir);
  fs.rmSync(absoluteOutput, { recursive: true, force: true });

  Logger.info(
    `Generating Allure report (singleFile=${singleFile}) -> ${absoluteOutput}`,
  );
  // Run the allure CLI with node directly (no shell) so paths with spaces stay intact
  const allureCli = path.join(
    path.dirname(require.resolve("allure")),
    "..",
    "cli.js",
  );
  const result = spawnSync(
    process.execPath,
    [allureCli, "generate", "--output", absoluteOutput],
    {
      stdio: "inherit",
      env: { ...process.env, ALLURE_SINGLE_FILE: String(singleFile) },
    },
  );

  const indexFile = path.join(absoluteOutput, "index.html");
  if (result.status !== 0 || !fs.existsSync(indexFile)) {
    throw new Error(
      `Allure report generation failed (exit code ${result.status}).`,
    );
  }
  return indexFile;
}

/** Formats milliseconds as e.g. "1m 05s" or "850ms". */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  if (hours) return `${hours}h ${minutes}m ${seconds}s`;
  return minutes ? `${minutes}m ${seconds}s` : `${totalSeconds}s`;
}
