/**
 * Feature Builder
 * Turns a suite plan into one small feature file per entry, so Cucumber runs exactly
 * the selected scenarios, in sheet order, with only the requested iteration.
 *
 * For each entry the generated file contains:
 *   - the feature header (renamed to the workflow, so the report groups by workflow)
 *   - the Background (and Rule header/Background, if the scenario is inside a Rule)
 *   - the scenario, renamed "<scenario> [<iteration>]"
 * and every table with an "Iteration" column (Examples tables and step data tables)
 * is trimmed to the rows of that iteration. Steps therefore receive only the matching
 * data and need no changes.
 */

import * as fs from "fs";
import * as path from "path";
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from "@cucumber/gherkin";
import { IdGenerator } from "@cucumber/messages";
import type * as messages from "@cucumber/messages";
import { SuitePlanEntry } from "./suitePlan";

export interface GeneratedScenario extends SuitePlanEntry {
  /** Absolute path of the generated feature file */
  generatedFile: string;
  /** Absolute path of the original feature file */
  sourceFile: string;
}

interface ParsedFeature {
  file: string;
  lines: string[];
  document: messages.GherkinDocument;
}

type Located = { location: messages.Location; tags?: readonly messages.Tag[] };

/** Lower-case and drop spaces/underscores/hyphens: "Loan Creation" == "LoanCreation" == "loan_creation". */
const normalizeName = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, "");
const sameText = (a: string, b: string) =>
  a.trim().replace(/\s+/g, " ").toLowerCase() === b.trim().replace(/\s+/g, " ").toLowerCase();

/** First line of a node, including its tags. */
const startLine = (node: Located) =>
  Math.min(node.location.line, ...(node.tags ?? []).map((t) => t.location.line));

const childNode = (child: messages.FeatureChild | messages.RuleChild): Located =>
  (child.scenario ?? child.background ?? ("rule" in child ? child.rule : undefined))!;

function findFeatureFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Features folder not found: ${dir}`);
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findFeatureFiles(full);
    return entry.name.endsWith(".feature") ? [full] : [];
  });
}

function parseFeatures(featuresDir: string): ParsedFeature[] {
  return findFeatureFiles(featuresDir).map((file) => {
    const text = fs.readFileSync(file, "utf8");
    const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());
    try {
      return { file, lines: text.split(/\r?\n/), document: parser.parse(text) };
    } catch (error) {
      throw new Error(`Could not parse ${file}: ${error instanceof Error ? error.message : error}`);
    }
  });
}

/** Lines [from, to] (1-based, inclusive) of the source. */
const slice = (lines: string[], from: number, to: number) => lines.slice(from - 1, to);

/** Start/end lines of each child, where a child ends right before the next one starts. */
function blocks<T extends messages.FeatureChild | messages.RuleChild>(
  children: readonly T[],
  endLine: number,
) {
  return children.map((child, i) => ({
    child,
    start: startLine(childNode(child)),
    end: i + 1 < children.length ? startLine(childNode(children[i + 1])) - 1 : endLine,
  }));
}

/**
 * Marks table rows that don't belong to the iteration for removal.
 * Tables without an "Iteration" column are left untouched. Rows whose Iteration cell is
 * an Examples placeholder (e.g. "<Iteration>") are kept, since the outline fills them in.
 * @returns false if the table has an Iteration column but no row matches.
 */
function filterTable(
  rows: readonly messages.TableRow[],
  hasHeader: boolean,
  iteration: string,
  dropLines: Set<number>,
): boolean | undefined {
  const header = rows[0];
  const body = hasHeader ? rows.slice(1) : rows;
  const column = header?.cells.findIndex((c) => sameText(c.value, "Iteration")) ?? -1;
  if (column < 0) return undefined;

  let matched = false;
  for (const row of body) {
    const value = row.cells[column]?.value ?? "";
    if (/^<.+>$/.test(value.trim()) || sameText(value, iteration)) {
      matched = true;
    } else {
      dropLines.add(row.location.line);
    }
  }
  return matched;
}

/** Builds the feature text for one plan entry, or throws with a readable reason. */
function buildFeatureText(parsed: ParsedFeature, entry: SuitePlanEntry): string {
  const feature = parsed.document.feature!;
  const { lines } = parsed;
  const lastLine = lines.length;
  const featureBlocks = blocks(feature.children, lastLine);

  // Locate the scenario, at feature level or inside a Rule
  let scenarioBlock: { start: number; end: number; scenario: messages.Scenario } | undefined;
  let ruleParts: string[] = [];
  for (const block of featureBlocks) {
    if (block.child.scenario && sameText(block.child.scenario.name, entry.scenario)) {
      scenarioBlock = { ...block, scenario: block.child.scenario };
      break;
    }
    const rule = block.child.rule;
    if (rule) {
      const ruleBlocks = blocks(rule.children, block.end);
      const match = ruleBlocks.find((rb) => rb.child.scenario && sameText(rb.child.scenario.name, entry.scenario));
      if (match) {
        scenarioBlock = { ...match, scenario: match.child.scenario! };
        const ruleHeaderEnd = ruleBlocks.length > 0 ? ruleBlocks[0].start - 1 : block.end;
        const ruleBackground = ruleBlocks.find((rb) => rb.child.background);
        ruleParts = [
          ...slice(lines, block.start, ruleHeaderEnd),
          ...(ruleBackground ? slice(lines, ruleBackground.start, ruleBackground.end) : []),
        ];
        break;
      }
    }
  }
  if (!scenarioBlock) {
    throw new Error(`Scenario '${entry.scenario}' not found in ${path.basename(parsed.file)}`);
  }

  // Trim tables to the requested iteration
  const dropLines = new Set<number>();
  if (entry.iteration) {
    const background = featureBlocks.find((b) => b.child.background)?.child.background;
    const steps = [...(background?.steps ?? []), ...scenarioBlock.scenario.steps];
    const results = [
      ...steps.filter((s) => s.dataTable).map((s) => filterTable(s.dataTable!.rows, true, entry.iteration, dropLines)),
      ...scenarioBlock.scenario.examples.map((ex) =>
        filterTable(ex.tableHeader ? [ex.tableHeader, ...ex.tableBody] : [], true, entry.iteration, dropLines),
      ),
    ];
    if (results.includes(false)) {
      throw new Error(
        `Iteration '${entry.iteration}' not found in the tables of scenario '${entry.scenario}' (${path.basename(parsed.file)})`,
      );
    }
  }

  // Feature header (tags, Feature line, description), renamed to the workflow
  const firstChild = featureBlocks[0]?.start ?? lastLine + 1;
  const header = slice(lines, 1, firstChild - 1).map((line, i) =>
    i + 1 === feature.location.line
      ? `${line.slice(0, (feature.location.column ?? 1) - 1)}${feature.keyword}: ${workflowTitle(entry, feature.name)}`
      : line,
  );
  const background = featureBlocks.find((b) => b.child.background);

  // Scenario, renamed with the iteration and without the rows of other iterations
  const { scenario } = scenarioBlock;
  const scenarioLines = slice(lines, scenarioBlock.start, scenarioBlock.end)
    .map((line, i) => ({ line, number: scenarioBlock!.start + i }))
    .filter(({ number }) => !dropLines.has(number))
    .map(({ line, number }) =>
      number === scenario.location.line
        ? `${line.slice(0, (scenario.location.column ?? 1) - 1)}${scenario.keyword}: ${scenarioTitle(entry, scenario.name)}`
        : line,
    );

  const backgroundLines = background
    ? slice(lines, background.start, background.end).filter((_, i) => !dropLines.has(background.start + i))
    : [];

  return [...header, ...backgroundLines, ...ruleParts, ...scenarioLines].join("\n") + "\n";
}

/** Feature title in the report: "3 - User should be able to create a loan" */
function workflowTitle(entry: SuitePlanEntry, featureName: string): string {
  const title = entry.workflow || featureName;
  return entry.seqId ? `${entry.seqId} - ${title}` : title;
}

function scenarioTitle(entry: SuitePlanEntry, scenarioName: string): string {
  return entry.iteration ? `${scenarioName} [${entry.iteration}]` : scenarioName;
}

const slug = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 50) || "scenario";

/**
 * Writes one feature file per plan entry into outputDir (cleared first).
 * Collects every problem (unknown feature/scenario/iteration) and throws them together,
 * so a sheet with several typos is fixed in one go.
 */
export function generateSuiteFeatures(
  plan: SuitePlanEntry[],
  featuresDir: string,
  outputDir: string,
): GeneratedScenario[] {
  const features = parseFeatures(featuresDir);
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const problems: string[] = [];
  const generated: GeneratedScenario[] = [];

  for (const entry of plan) {
    // The Feature column may hold the Feature title or the file name
    const candidates = features.filter(
      (f) =>
        normalizeName(f.document.feature?.name ?? "") === normalizeName(entry.feature) ||
        normalizeName(path.basename(f.file, ".feature")) === normalizeName(entry.feature),
    );
    if (candidates.length === 0) {
      problems.push(`Row ${entry.excelRow}: feature '${entry.feature}' not found in ${featuresDir}`);
      continue;
    }

    // If the name matches several files, use the one that has the scenario
    const errors: string[] = [];
    let text: string | undefined;
    let source: ParsedFeature | undefined;
    for (const candidate of candidates) {
      try {
        text = buildFeatureText(candidate, entry);
        source = candidate;
        break;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    if (!text || !source) {
      problems.push(`Row ${entry.excelRow}: ${errors.join("; ")}`);
      continue;
    }

    const fileName = `${String(entry.index).padStart(3, "0")}-${slug(entry.feature)}-${slug(entry.scenario)}${entry.iteration ? `-${slug(entry.iteration)}` : ""}.feature`;
    const generatedFile = path.join(outputDir, fileName);
    fs.writeFileSync(generatedFile, text, "utf8");
    generated.push({ ...entry, generatedFile, sourceFile: source.file });
  }

  if (problems.length > 0) {
    throw new Error(`The test suite sheet has ${problems.length} problem(s):\n  - ${problems.join("\n  - ")}`);
  }
  return generated;
}
