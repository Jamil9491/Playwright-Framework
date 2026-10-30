/**
 * Excel Suite Runner
 * Runs the scenarios selected in the test-suite workbook (Execute / Scenario_Execute = Y),
 * in sheet order, each with its Iteration, then generates and emails the Allure report
 * like runTests.ts.
 *
 * Usage:
 *   npm run test:suite                                   (SUITE_WORKBOOK / SUITE_SHEET from .env)
 *   npm run test:suite -- --sheet TSEBDD
 *   npm run test:suite -- --workbook BDD_TSE_TLT.xlsx --sheet APISanity-OL
 *   npm run test:suite -- --dry-run                      (any other args go to cucumber-js)
 */

import fs from "fs";
import path from "path";
import { config } from "../config/config";
import Logger from "../utils/logger";
import { buildSuitePlan } from "../suite/suitePlan";
import { generateSuiteFeatures } from "../suite/featureBuilder";
import { runCucumberAndNotify } from "./runTests";

const OUTPUT_DIR = path.join(process.cwd(), ".cucumber", "suite");
const PLAN_FILE = path.join(OUTPUT_DIR, "plan.json");

/** Takes "--name value" / "--name=value" out of args and returns its value. */
function takeOption(args: string[], name: string): string | undefined {
  const index = args.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (index < 0) return undefined;
  const [arg] = args.splice(index, 1);
  return arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : args.splice(index, 1)[0];
}

/** A bare file name is looked up in the test-data folder; anything else is a path. */
function resolveWorkbook(workbook: string): string {
  if (path.isAbsolute(workbook)) return workbook;
  if (workbook.includes("/") || workbook.includes("\\")) return path.resolve(workbook);
  return path.resolve(config.TEST_DATA_PATH, workbook);
}

async function main(): Promise<void> {
  const cucumberArgs = process.argv.slice(2);
  const workbookPath = resolveWorkbook(takeOption(cucumberArgs, "workbook") ?? config.SUITE_WORKBOOK);
  const sheet = takeOption(cucumberArgs, "sheet") ?? config.SUITE_SHEET;

  // Workflows share a browser session between scenarios, which needs a single process
  const parallel = takeOption(cucumberArgs, "parallel");
  if (parallel !== undefined) {
    Logger.warn("--parallel is ignored for suite runs: scenarios of a workflow run in order in one browser.");
  }

  Logger.info(`📋 Test suite: ${path.basename(workbookPath)} › ${sheet}`);

  let generated;
  try {
    const plan = buildSuitePlan(workbookPath, sheet);
    if (plan.length === 0) {
      Logger.warn("Nothing to run: no workflow with Execute=Y has scenarios with Scenario_Execute=Y.");
      process.exit(0);
    }
    generated = generateSuiteFeatures(plan, path.resolve(config.SUITE_FEATURES_DIR), OUTPUT_DIR);
  } catch (error) {
    Logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  fs.writeFileSync(PLAN_FILE, JSON.stringify(generated, null, 2), "utf8");

  let lastWorkflow = "";
  for (const entry of generated) {
    const workflow = `${entry.seqId} - ${entry.workflow}`;
    if (workflow !== lastWorkflow) {
      Logger.info(`  ▶ Workflow ${workflow}`);
      lastWorkflow = workflow;
    }
    Logger.info(`     ${entry.index}. ${entry.feature} › ${entry.scenario}${entry.iteration ? ` [${entry.iteration}]` : ""}`);
  }

  // Shown in the report email
  process.env.TEST_SUITE = `${path.basename(workbookPath)} › ${sheet}`;

  const exitCode = await runCucumberAndNotify(
    [...generated.map((g) => path.relative(process.cwd(), g.generatedFile)), ...cucumberArgs],
    // The sheet decides what runs, so tag filters from .env don't apply
    { SUITE_PLAN_FILE: PLAN_FILE, CUCUMBER_TAGS: "" },
  );
  process.exit(exitCode);
}

main();
