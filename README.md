# Playwright + Cucumber Test Automation Framework

A TypeScript test automation framework for Web Application, built on **Playwright**, **Cucumber.js** (BDD) and **Allure 3** reporting. Tests are written as Gherkin feature files. Pages are modelled as page objects that drive the UI through one shared control layer (`AppWrapper`). What runs, and with which data variation, is controlled from an Excel test suite.

## 🚀 Features

- **BDD with Cucumber.js:** scenarios in Gherkin. Test data lives in the feature files (Examples tables and step data tables).
- **Excel test suite:** choose workflows, scenarios and data variations (`Iteration`) in `TestSuite.xlsx`, without editing tags.
- **Workflows:** scenarios in the same workflow share one browser session, for example Login → Create ILC → Logout → Login as another user.
- **`AppWrapper` control layer:** a single `executeStep(locator, UIOps.X, data)` call handles inputs, PrimeNG dropdowns, date pickers, checkboxes, buttons and file uploads.
- **Page Object Model with `POManager`:** pages are created lazily and reached through `this.POManager` in every step.
- **PostgreSQL service:** query helpers, storing results in `GlobalVariables`, transactions and polling.
- **Allure 3 reports:** a single-file HTML report with screenshots on failure, emailed automatically after each run.
- **Multi-environment config** through `.env` (`local`, `development`, `staging`, `production`).
- Chromium, Firefox and WebKit, headed or headless, maximized or with a fixed viewport.

## 📁 Project Structure

The framework (`src/Framework`) is kept separate from the application tests (`src/tests`).

```
Playwright-framework-main/
├── src/
│   ├── Framework/                        # Reusable framework code (no app-specific logic)
│   │   ├── config/config.ts              # Reads .env into a typed config object
│   │   ├── controls/appWrapper.ts        # executeStep + UIOps: the UI control layer
│   │   ├── dataSourceAction/
│   │   │   └── posgreSQLService.ts       # PostgreSQL query helpers
│   │   ├── globalVariables.ts            # Values shared between steps/scenarios
│   │   ├── Report/
│   │   │   ├── reportService.ts          # Allure report generation + run summary
│   │   │   ├── emailService.ts           # Report email (nodemailer)
│   │   │   └── email-templates/report-email.html
│   │   ├── scripts/
│   │   │   ├── runTests.ts               # npm test: runs Cucumber, then report + email
│   │   │   ├── runSuite.ts               # npm run test:suite: Excel-driven run
│   │   │   ├── notify.ts                 # Report + email after a run
│   │   │   └── sendReportEmail.ts        # npm run report:email
│   │   ├── suite/                        # Excel suite: plan, feature generation, run context
│   │   │   ├── suitePlan.ts
│   │   │   ├── featureBuilder.ts
│   │   │   └── suiteContext.ts
│   │   ├── support/
│   │   │   ├── world.ts                  # Cucumber World (browser, page, POManager, logger)
│   │   │   └── hooks.ts                  # BeforeAll/Before/After/AfterAll, workflow sessions
│   │   └── utils/                        # logger, ScreenshotManager, browser/window helpers
│   └── tests/                            # Application tests
│       ├── features/                     # *.feature files
│       ├── pages/                        # Page objects + basePage.ts + POManager.ts
│       ├── stepDefinitions/              # Step definitions
│       └── test-data/                    # TestSuite.xlsx and files to upload
├── allurerc.mjs                          # Allure 3 report configuration
├── cucumber.js                           # Cucumber configuration
├── tsconfig.json                         # TypeScript config (alias @/* → src/*)
├── .env-example                          # All settings with comments; copy to .env
└── package.json
```

Generated folders (git-ignored): `allure-results/`, `allure-report/`, `allure-history/`, `.cucumber/`, `screenshots/`, `email-output/`.

## 🛠️ Installation

**Prerequisites:** Node.js 18 or higher, npm.

```bash
git clone <repository-url>
cd Playwright-framework-main
npm install
npx playwright install          # browser binaries
cp .env-example .env            # then edit .env
```

## ⚙️ Configuration

All settings come from `.env`. `.env-example` documents every option. `.env` holds credentials, so it is git-ignored and must never be committed.

| Group       | Variables                                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Environment | `NODE_ENV` (`local` / `development` / `staging` / `production`) selects `LOCAL_BASE_URL`, `DEV_BASE_URL`, `STAGING_BASE_URL` or `PROD_BASE_URL`      |
| Browser     | `BROWSER` (`chromium` / `firefox` / `webkit`), `HEADLESS`, `START_MAXIMIZED`, `VIEWPORT_WIDTH` / `VIEWPORT_HEIGHT`, `SLOW_MO`                        |
| Timeouts    | `TIMEOUT` (Playwright actions, ms), `STEP_TIMEOUT` (one Cucumber step, keep it above `TIMEOUT`)                                                      |
| Test data   | `TEST_DATA_PATH`: folder for `TestSuite.xlsx` and files to upload                                                                                    |
| Excel suite | `SUITE_WORKBOOK`, `SUITE_SHEET`, `SUITE_FEATURES_DIR`, `SUITE_STOP_WORKFLOW_ON_FAILURE`                                                              |
| Database    | `POSTGRES_CONNECTION_STRING`, or `POSTGRES_HOST` / `PORT` / `NAME` / `USER` / `PASSWORD` / `SSL`, plus `POSTGRES_POOL_MAX`, `POSTGRES_QUERY_TIMEOUT` |
| Reporting   | `ALLURE_RESULTS_DIR`, `SCREENSHOT_ON_FAIL`                                                                                                           |
| Email       | `EMAIL_NOTIFICATION`, `EMAIL_SEND_ON`, `SMTP_*`, `EMAIL_FROM` / `TO` / `CC` / `BCC`, and more (see [Email Notifications](#-email-notifications))     |
| Tags        | `CUCUMBER_TAGS`: default tag expression for `npm test`                                                                                               |

The active configuration is printed once at the start of every run.

## ▶️ Running Tests

There are two ways to run tests:

**1. Excel test suite (recommended for regression):** `TestSuite.xlsx` decides what runs.

```bash
npm run test:suite                                        # SUITE_WORKBOOK / SUITE_SHEET from .env
npm run test:suite -- --sheet Smoke                       # another sheet
npm run test:suite -- --workbook Other.xlsx --sheet UAT   # another workbook (file name in TEST_DATA_PATH, or a path)
npm run test:suite -- --dry-run                           # check the sheet and the steps without running anything
```

**2. Tags:** run features directly with a Cucumber tag expression.

```bash
npm test                                      # all features (or CUCUMBER_TAGS from .env)
npm test -- --tags "@login-tfs"               # one tag
npm test -- --tags "@ilc-sight and not @wip"  # any tag expression
npm run test:headless                         # also: test:headed, test:chrome, test:firefox, test:webkit
```

Both commands generate the Allure report and send the email (when enabled) after the run. They exit with Cucumber's exit code, so CI fails when a test fails.

## 📋 Excel Test Suite

Sheet `Regression` in `src/tests/test-data/TestSuite.xlsx`:

| Seq_id | Execute | WorkFlow_Des                      | Feature                | Scenario                              | Scenario_Execute | Description      | Iteration |
| ------ | ------- | --------------------------------- | ---------------------- | ------------------------------------- | ---------------- | ---------------- | --------- |
| 3      | Y       | Login, create an ILC, switch user |                        |                                       |                  |                  |           |
| 3      |         |                                   | Login TFS Application  | User Should be Login TFS Application  | Y                | Login as maker   | DV_1      |
| 3      |         |                                   | Complete ilcSight      | Complete ilcSight                     | Y                | Create ILC       | DV_2      |
| 3      |         |                                   | logout TFS Application | User should be logout TFS Application | Y                | Logout           |           |
| 3      |         |                                   | Login TFS Application  | User Should be Login TFS Application  | Y                | Login as checker | DV_2      |

| Column             | Meaning                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `Seq_id`           | Workflow number                                                                                      |
| `Execute`          | `Y`/`N` on a **workflow row**: the row that starts a workflow                                        |
| `WorkFlow_Des`     | Workflow description, used as the group name in the report                                           |
| `Feature`          | Feature title (`Feature: Login TFS Application`) or feature file name                                |
| `Scenario`         | Scenario name, as written in the feature file                                                        |
| `Scenario_Execute` | `Y` runs the scenario, `N` skips it                                                                  |
| `Description`      | Free text                                                                                            |
| `Iteration`        | Data variation, such as `DV_2`. `DV_1, DV_2` runs the scenario twice. Leave it empty to use all rows |

The column order doesn't matter. Names are matched case-insensitively.

**How it works:**

- **Selection:** the rows under a workflow row, up to the next workflow row, are that workflow's scenarios. Only workflows with `Execute=Y` run, and inside them only rows with `Scenario_Execute=Y`, in sheet order. The same scenario can appear more than once.
- **Iterations:** every table with an `Iteration` column (Examples tables and step data tables, including the Background) is trimmed to the requested iteration, so steps receive only that row and need no iteration logic. `GlobalVariables.Iteration`, `Seq_Id` and `WorkFlow_Desc` hold the current values.
- **Shared session:** scenarios in the same workflow continue in the **same browser** and keep `GlobalVariables`, like one long test. Each new workflow starts with a fresh browser and cleared globals.
- **Failures:** with `SUITE_STOP_WORKFLOW_ON_FAILURE=true`, a failure skips the rest of that workflow. The next workflow still runs.
- **Sheet validation:** an unknown feature, scenario or iteration is reported for every bad row before anything runs.
- **Report:** the report groups scenarios as `<Seq_id> - <WorkFlow_Des>`, and names each one `<Scenario> [<Iteration>]`. The email shows the workbook and sheet under "Test suite".
- **No `--parallel`:** a workflow shares one browser, so suite runs are sequential and `--parallel` is ignored.

Close the workbook in Excel, or at least save it, before running. The runner reads the saved file.

## 📝 Writing Tests

A new screen needs four pieces: a feature file, a page object, a `POManager` entry and step definitions.

### 1. Feature file: `src/tests/features/*.feature`

Put the test data in the feature file and add an `Iteration` column so the suite can pick a row:

```gherkin
@loginTfs-Feature
Feature: Login TFS Application

  @login-tfs
  Scenario Outline: User Should be Login TFS Application
    Given Application Login Screen is Opened
    When User Enter Values in respective fields as
      | UserName   | Password   | Iteration   |
      | <Username> | <Password> | <Iteration> |
    And User Clicks Sign In Button
    Then user profile menu is visible on page

    Examples:
      | Username | Password | Iteration |
      | log      | log      | DV_1      |
      | input    | input    | DV_2      |
```

- **Workflow steps:** write scenarios as steps of a workflow. A scenario that continues where the previous one stopped, like `Complete ilcSight` after `Login TFS Application`, shouldn't log in again. Put the login in the workflow instead.
- **Background:** use a `Background` to check the starting state. For example, the logout feature starts with `Given user profile menu is visible on page`.
- **Step reuse:** step definitions are global. The logout feature reuses `user profile menu is visible on page` from `loginTFSSteps.ts`, so don't define the same step text twice.
- **Tags:** tag every feature and scenario (`@login-tfs`, `@ilc-sight`, …) so it can also run with `npm test -- --tags`. Tag database-only scenarios with `@db`; they run without a browser.

### 2. Page object: `src/tests/pages/*.ts`

Extend `BasePage`, which provides `page`, `appWrapper`, `logger` and `config`. Declare locators in the constructor, and drive every control through `appWrapper.executeStep`:

```typescript
import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { UIOps } from "@/Framework/controls/appWrapper";

export class LoginTFSPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId("login-username");
    this.signInButton = page.getByTestId("login-submit");
  }

  public async open(): Promise<void> {
    // Skip the reload when the app is already on the login page (e.g. after logout)
    if (!this.appWrapper.isAtUrl(this.config.BASE_URL)) {
      await this.appWrapper.navigateTo(this.config.BASE_URL);
    }
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
  }

  public async enterUsername(username: string): Promise<void> {
    await this.appWrapper.executeStep(this.usernameInput, UIOps.Set, username);
  }

  public async submit(): Promise<void> {
    await this.appWrapper.executeStep(this.signInButton, UIOps.Set);
  }
}
```

**`executeStep(locator, operation, data?, options?)`** looks at the element and performs the right action:

| `UIOps`                       | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Set`                         | **Text input / textarea:** fills `data`. **Button or link:** clicks. **Checkbox / radio:** checks. **Native `<select>`:** selects. **PrimeNG dropdown** (`getByRole("combobox")`): opens it and picks the option `data`, retrying if the panel didn't open. **PrimeNG date picker:** types the date (e.g. `10/15/2026`) and confirms that it stuck. **File input or upload zone:** uploads the file named `data` from `TEST_DATA_PATH`. |
| `Read`                        | Returns the value or text                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Verify`                      | Asserts the value or text equals `data`                                                                                                                                                                                                                                                                                                                                                                                                 |
| `Uncheck` / `Clear` / `Hover` | As named                                                                                                                                                                                                                                                                                                                                                                                                                                |

It highlights the element, waits for it, and saves a screenshot and a clear log line when an action fails. `options` accepts `{ timeout, highlight, screenshotOnFailure }`. `AppWrapper` also has navigation and assertion helpers: `navigateTo`, `isAtUrl`, `waitForPageLoad`, `assertElementVisible`, `reloadPage`, and others.

**Locator rules:**

- Prefer `getByTestId(...)`, which matches `data-testid`. For PrimeNG `p-select`, target the combobox: `page.getByTestId("...-control").getByRole("combobox")`. A bare `.locator("span")` matches several elements and fails Playwright's strict mode.
- Keep assertions (`expect(...)`) in page methods named `verify…` or `assert…`.

### 3. Register the page in `POManager.ts`

```typescript
private _logutTFSPage?: LogutTFSPage;

get logutTFSPage(): LogutTFSPage {
  return (this._logutTFSPage ??= new LogutTFSPage(this.page));
}
```

### 4. Step definitions: `src/tests/stepDefinitions/*.ts`

Use pages only through `this.POManager`, and keep steps thin:

```typescript
import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { ICustomWorld } from "../../Framework/support/world";

Given(
  "Application Login Screen is Opened",
  async function (this: ICustomWorld) {
    await this.POManager.LoginTFSPage.open();
  },
);

When(
  "User Enter Values in respective fields as",
  async function (this: ICustomWorld, dataTable: DataTable) {
    // Header row + one value row (the outline fills in the current iteration)
    const [{ UserName, Password }] = dataTable.hashes();
    await this.POManager.LoginTFSPage.enterUsername(UserName);
    await this.POManager.LoginTFSPage.enterPassword(Password);
  },
);
```

**Reading data tables:**

| Table layout                                     | Method                 | Result                                                      |
| ------------------------------------------------ | ---------------------- | ----------------------------------------------------------- |
| Header row, then value rows                      | `dataTable.hashes()`   | `[{ UserName: "log", Password: "log", Iteration: "DV_1" }]` |
| Vertical `\| key \| value \|`, exactly 2 columns | `dataTable.rowsHash()` | `{ UserName: "log", Password: "log" }`                      |

Keys must match the header text exactly, including case.

### Sharing values: `GlobalVariables`

To pass a value between steps, or between scenarios in the same workflow, use `GlobalVariables`. For example, store a reference number created in one scenario and search for it in the next:

```typescript
import { GlobalKey, GlobalVariables } from "@/Framework/globalVariables";

GlobalVariables.set(GlobalKey.ILC_SIGHT_REF_NUMB, refNumber); // typed keys (add new ones to GlobalKey)
GlobalVariables.ILC_SIGHT_REF_NUMB; // shorthand getter
GlobalVariables.setDynamic("approvalId", id); // free-form keys
GlobalVariables.getDynamic<string>("approvalId");
```

Values are cleared before each scenario in a tag run, and before each workflow in a suite run.

### Database steps: `posgreSQLService`

```typescript
import { posgreSQLService } from "@/Framework/dataSourceAction/posgreSQLService";

const rows = await posgreSQLService.getRows<Row>("SELECT ... WHERE id = $1", [
  id,
]);
const first = await posgreSQLService.getFirstRow<Row>(sql, params);
const value = await posgreSQLService.getSingleValue<string>(sql, params);
const exists = await posgreSQLService.exists(sql, params);
await posgreSQLService.fetchAndStore(GlobalKey.ILC_SIGHT_REF_NUMB, sql); // first column → GlobalVariables
await posgreSQLService.pollUntil(
  sql,
  params, // wait for a record to appear
  (rows) => rows.some((r) => r.status === "COMPLETED"),
  { timeoutMs: 90000 },
);
```

Always pass parameters as `$1, $2, …` and never build SQL by string concatenation. The connection pool opens on first use and closes after the run. See `employeeSkills.feature` for a complete example.

## 📊 Allure Reports

The framework uses **Allure 3** (the `allure` npm package, no Java required). Settings live in `allurerc.mjs`.

```bash
npm run allure:generate     # build allure-report/ from allure-results/
npm run allure:open         # open the generated report
npm run allure:watch        # live report while tests run
```

- **Results:** `allure-results/` is cleared at the start of every `npm test` / `npm run test:suite`.
- **Screenshots:** failed scenarios get a screenshot attached (`SCREENSHOT_ON_FAIL=true`).
- **History:** trends are kept in `allure-history/history.jsonl`.

Tags map to Allure labels and links (see `cucumber.js`):

```gherkin
@epic:TradeFinance @severity:critical @owner:QA
Feature: Complete ilcSight

  @issue:TFS-123 @tms:TC-456
  Scenario Outline: Complete ilcSight
```

## 📧 Email Notifications

When `EMAIL_NOTIFICATION=true`, every run generates the Allure report as one HTML file (`allure-report/index.html`) and emails it with a summary.

| Variable                                             | Description                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `EMAIL_NOTIFICATION`                                 | `true` to send the report after every run                                             |
| `EMAIL_SEND_ON`                                      | `always`, `failure` or `success`                                                      |
| `EMAIL_DRY_RUN`                                      | `true` saves the email to `email-output/*.eml` instead of sending it                  |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE`            | SMTP server (Office 365: `smtp.office365.com` / `587` / `false`)                      |
| `SMTP_USER` / `SMTP_PASSWORD`                        | SMTP login                                                                            |
| `EMAIL_FROM` / `EMAIL_TO` / `EMAIL_CC` / `EMAIL_BCC` | Sender and comma-separated recipients                                                 |
| `EMAIL_SUBJECT`                                      | Subject template, e.g. `[{{status}}] {{projectName}} - {{passed}}/{{total}} passed`   |
| `EMAIL_PROJECT_NAME`                                 | Project name in the subject and body                                                  |
| `EMAIL_TEMPLATE_PATH`                                | HTML body template (default `src/Framework/Report/email-templates/report-email.html`) |
| `EMAIL_ATTACH_REPORT` / `EMAIL_MAX_ATTACHMENT_MB`    | Attach the report, and skip the attachment above this size (default 20 MB)            |

Placeholders for the subject and template: `{{projectName}}` `{{status}}` `{{total}}` `{{passed}}` `{{failed}}` `{{broken}}` `{{skipped}}` `{{passRate}}` `{{duration}}` `{{env}}` `{{baseUrl}}` `{{browser}}` `{{tags}}` `{{suite}}` `{{date}}` `{{host}}`, plus `{{statusColor}}`, `{{failedTestsTable}}` and `{{reportNote}}` in the template.

```bash
npm run report:email    # email the report for the existing allure-results (ignores EMAIL_NOTIFICATION / EMAIL_SEND_ON)
```

A `--dry-run` also sends an email when notifications are enabled. Set `EMAIL_NOTIFICATION=false` while checking a sheet.

## ✅ Framework Guidelines

- **Framework vs tests:**
  - Generic, reusable code goes in `src/Framework`. Anything specific to TFS screens goes in `src/tests`.
  - Framework code must not import from `src/tests`. The one exception is `POManager`, which the World creates.
- **One way to touch the UI:**
  - Pages call `appWrapper.executeStep`. Don't use raw `locator.click()` / `fill()` in pages.
  - If a control type isn't supported, extend `AppWrapper` once, so every page benefits.
- **Steps stay thin:**
  - A step calls page methods and holds no locators or waits.
  - Use pages through `this.POManager`, never `new SomePage(this.page)`.
- **Data in feature files:**
  - Keep values in Examples tables and step tables, with an `Iteration` column.
  - Use `TEST_DATA_PATH` only for files to upload and the suite workbook.
- **Waiting:**
  - Wait for something visible, such as `expect(locator).toBeVisible()` or an option appearing, instead of fixed sleeps.
  - Change timeouts through `TIMEOUT` / `STEP_TIMEOUT`, not per call, unless a single step is known to be slow.
- **Workflows:**
  - Order scenarios in the sheet so each one starts where the previous one ended.
  - End a scenario in a stable state, for example by waiting for the page that follows a click, so the next scenario starts cleanly.
- **Secrets:**
  - Keep credentials in `.env`, never in feature files that hold production data, or in code.
  - `.env` is git-ignored.
- **Naming:**
  - Files are named `<screen>.feature`, `<screen>Page.ts` and `<screen>Steps.ts`.
  - Page methods describe user actions, such as `enterUsername`, `submit` and `verifyUserLoggedIn`.

## 🐛 Troubleshooting

| Problem                                                                               | Fix                                                                                                                                     |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Undefined step`                                                                      | The step text in the feature doesn't match any step definition. Check spelling and parameters, or run `npm run test:suite -- --dry-run` |
| `strict mode violation: locator resolved to N elements`                               | Make the locator unique, e.g. `getByRole("combobox")` inside the PrimeNG control                                                        |
| `rowsHash can only be called on a data table where all rows have exactly two columns` | The table is horizontal. Use `dataTable.hashes()`                                                                                       |
| Date field empties after the next step                                                | Use `executeStep(dateInput, UIOps.Set, "MM/DD/YYYY")`, which types into the PrimeNG date picker instead of filling it                   |
| `Upload failed: file not found`                                                       | Put the file in `TEST_DATA_PATH` and pass only its name                                                                                 |
| Suite: `feature '…' not found` / `scenario '…' not found`                             | `Feature` must be the feature title or file name, and `Scenario` the exact scenario name                                                |
| Suite: a scenario can't find the login form                                           | It runs after a scenario that already logged in, in the same workflow. Add a logout step, or move it to its own workflow                |
| `Allure results directory not found`                                                  | No scenario ran (e.g. a tag filter matched nothing)                                                                                     |
| `ECONNREFUSED` on database steps                                                      | Check `POSTGRES_*` in `.env` and that the server is reachable                                                                           |
| Browser not found                                                                     | `npx playwright install`                                                                                                                |

Debug Playwright calls with `DEBUG=pw:api npm test`, or slow the run down with `SLOW_MO=500`.

## 📚 Resources

- [Playwright](https://playwright.dev/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [Allure Report 3](https://allurereport.org/docs/v3/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
