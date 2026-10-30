/**
 * Test Runner
 * Runs cucumber-js (forwarding all CLI arguments), then generates and emails the
 * Allure report when EMAIL_NOTIFICATION=true. Exits with cucumber's exit code so
 * CI still fails when tests fail.
 *
 * Usage: ts-node src/Framework/scripts/runTests.ts [cucumber-js args]
 *    e.g. ts-node src/Framework/scripts/runTests.ts --tags "@smoke"
 *
 * The Excel-driven suite runner (runSuite.ts) reuses runCucumberAndNotify().
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { config } from "../config/config";
import Logger from "../utils/logger";
import { notify } from "./notify";

/**
 * Clears old Allure results, runs cucumber-js with the given arguments, then sends the
 * report email (if enabled).
 * @param env - Extra environment variables for the cucumber process.
 * @returns cucumber's exit code.
 */
export async function runCucumberAndNotify(
  cucumberArgs: string[],
  env: NodeJS.ProcessEnv = {},
): Promise<number> {
  // Start from clean results so the report and email only cover this run
  fs.rmSync(path.join(process.cwd(), config.ALLURE_RESULTS_DIR), {
    recursive: true,
    force: true,
  });

  const cucumberBin = path.join(
    path.dirname(require.resolve("@cucumber/cucumber/package.json")),
    "bin",
    "cucumber.js",
  );
  const run = spawnSync(process.execPath, [cucumberBin, ...cucumberArgs], {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  const exitCode = run.status ?? 1;

  try {
    await notify();
  } catch (error) {
    // Don't hide the test result behind a notification problem; just report it
    Logger.error(
      `Report email failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return exitCode;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Make --tags from the command line available to the email ({{tags}})
  const tagsIndex = args.findIndex((arg) => arg === "--tags" || arg === "-t");
  const inlineTags = args.find((arg) => arg.startsWith("--tags="));
  if (tagsIndex >= 0 && args[tagsIndex + 1]) {
    process.env.CUCUMBER_TAGS = args[tagsIndex + 1];
  } else if (inlineTags) {
    process.env.CUCUMBER_TAGS = inlineTags.slice("--tags=".length);
  }

  process.exit(await runCucumberAndNotify(args));
}

if (require.main === module) {
  main();
}
