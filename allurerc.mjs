/**
 * Allure 3 Report Configuration
 * Used by the `allure` CLI (allure generate / open / watch / run).
 * Docs: https://allurereport.org/docs/v3/
 */

import { defineConfig } from "allure";

export default defineConfig({
  name: "Playwright Automation Report",

  // Where allure-cucumberjs writes raw results (see cucumber.js -> formatOptions.resultsDir)
  resultsDir: "./allure-results",

  // Where the generated HTML report is written
  output: "./allure-report",

  // Trend/history across runs: each generate appends one entry to this file
  historyPath: "./allure-history/history.jsonl",
  historyLimit: 20,

  plugins: {
    awesome: {
      options: {
        reportLanguage: "en",
        // Single self-contained HTML file; turned on automatically for the email attachment
        singleFile: process.env.ALLURE_SINGLE_FILE === "true",
        groupBy: ["parentSuite", "suite", "subSuite"],
      },
    },
  },
});
