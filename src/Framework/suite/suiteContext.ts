/**
 * Suite Context
 * Lets hooks know which suite entry (workflow, iteration, ...) the running scenario
 * belongs to. The suite runner writes the plan to a JSON file and passes its path in
 * SUITE_PLAN_FILE; outside a suite run this module reports "not a suite run".
 */

import * as fs from "fs";
import * as path from "path";
import type { GeneratedScenario } from "./featureBuilder";

let entries: Map<string, GeneratedScenario> | undefined;

const key = (file: string) => path.resolve(file).toLowerCase();

function load(): Map<string, GeneratedScenario> {
  if (!entries) {
    entries = new Map();
    const planFile = process.env.SUITE_PLAN_FILE;
    if (planFile && fs.existsSync(planFile)) {
      const plan: GeneratedScenario[] = JSON.parse(fs.readFileSync(planFile, "utf8"));
      plan.forEach((entry) => entries!.set(key(entry.generatedFile), entry));
    }
  }
  return entries;
}

/** True when tests were started by the Excel suite runner. */
export const isSuiteRun = () => load().size > 0;

/** The suite entry for a scenario, looked up by its feature file (pickle.uri). */
export const getSuiteEntry = (featureUri: string) => load().get(key(featureUri));

/** Scenarios of the same workflow share a browser session and global variables. */
export const workflowKey = (entry: GeneratedScenario) => `${entry.seqId}|${entry.workflow}`;
