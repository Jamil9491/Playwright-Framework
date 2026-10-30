/**
 * Suite Plan
 * Reads the test-suite sheet of an Excel workbook and builds the ordered list of
 * scenarios to run (TypeScript port of ScenarioExecutor.ExecuteScenariosFromExcel).
 *
 * Sheet layout (header row, column order doesn't matter, names are case-insensitive):
 *   Seq_id | Execute | WorkFlow_Des | Feature | Scenario | Scenario_Execute | Description | Iteration
 *
 * - A row with Execute = Y/N starts a workflow. The rows below it, up to the next
 *   workflow row, are that workflow's scenarios.
 * - Only workflows with Execute = Y run, and inside them only rows with Scenario_Execute = Y.
 * - Iteration selects the data variation (e.g. DV_3). Several can be given as "DV_1, DV_2";
 *   each one becomes a separate run. Empty = run all rows.
 */

import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

export interface SuitePlanEntry {
  /** 1-based position in the run order */
  index: number;
  seqId: string;
  workflow: string;
  feature: string;
  scenario: string;
  description: string;
  /** Empty string = no iteration filter */
  iteration: string;
  /** Excel row number, for error messages */
  excelRow: number;
}

const REQUIRED_COLUMNS = ["Execute", "Scenario_Execute", "Feature", "Scenario"];

/** Case-insensitive column lookup for a sheet_to_json row. */
function cell(row: Record<string, unknown>, column: string): string {
  const key = Object.keys(row).find(
    (k) => k.trim().toLowerCase() === column.toLowerCase(),
  );
  return key === undefined ? "" : String(row[key] ?? "").trim();
}

const isFlag = (value: string) => ["Y", "N"].includes(value.toUpperCase());

/**
 * Builds the run plan from the given workbook sheet.
 * @throws if the workbook or sheet is missing, or required columns are absent.
 */
export function buildSuitePlan(workbookPath: string, sheetName: string): SuitePlanEntry[] {
  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Suite workbook not found: ${workbookPath}`);
  }

  const workbook = XLSX.readFile(workbookPath);
  const actualSheet = workbook.SheetNames.find(
    (name) => name.toLowerCase() === sheetName.toLowerCase(),
  );
  if (!actualSheet) {
    throw new Error(
      `Sheet '${sheetName}' not found in ${path.basename(workbookPath)}. Available sheets: ${workbook.SheetNames.join(", ")}`,
    );
  }

  // raw: false -> cell text as displayed in Excel (keeps "DV_01", dates, etc. as text)
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[actualSheet], {
    defval: "",
    raw: false,
  });

  const headers = Object.keys(rows[0] ?? {}).map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_COLUMNS.filter((c) => !headers.includes(c.toLowerCase()));
  if (missing.length > 0) {
    throw new Error(
      `Sheet '${actualSheet}' does not contain required columns: ${missing.join(", ")}`,
    );
  }

  const plan: SuitePlanEntry[] = [];
  let workflowEnabled = false;
  let seqId = "";
  let workflow = "";

  rows.forEach((row, i) => {
    const execute = cell(row, "Execute");

    // Workflow header row
    if (isFlag(execute)) {
      workflowEnabled = execute.toUpperCase() === "Y";
      seqId = cell(row, "Seq_id");
      workflow = cell(row, "WorkFlow_Des");
      return;
    }

    if (!workflowEnabled || cell(row, "Scenario_Execute").toUpperCase() !== "Y") {
      return;
    }

    const feature = cell(row, "Feature");
    const scenario = cell(row, "Scenario");
    if (!feature || !scenario) {
      return;
    }

    const iterations = cell(row, "Iteration")
      .split(/[,;]/)
      .map((it) => it.trim())
      .filter(Boolean);

    for (const iteration of iterations.length > 0 ? iterations : [""]) {
      plan.push({
        index: plan.length + 1,
        seqId: cell(row, "Seq_id") || seqId,
        workflow,
        feature,
        scenario,
        description: cell(row, "Description"),
        iteration,
        excelRow: i + 2, // +1 for the header row, +1 because Excel rows start at 1
      });
    }
  });

  return plan;
}
