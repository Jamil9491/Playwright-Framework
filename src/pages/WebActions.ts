import { expect, Locator, Page } from "@playwright/test";

export enum UIOps {
  Set = "SET",
  Read = "READ",
  Verify = "VERIFY",
  Click = "CLICK",
  Check = "CHECK",
  Uncheck = "UNCHECK",
  Select = "SELECT",
  Clear = "CLEAR",
  Hover = "HOVER",
}

export interface WebActionOptions {
  timeout?: number;
  highlight?: boolean;
  screenshotOnFailure?: boolean;
}

export class WebActions {
  private readonly defaultTimeout: number;

  constructor(
    private readonly page: Page,
    defaultTimeout = Number(process.env.TIMEOUT ?? 30000),
  ) {
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Generic reusable entry point for Playwright UI operations.
   */
  public async executeStep(
    locator: Locator,
    operation: UIOps,
    data = "",
    options: WebActionOptions = {},
  ): Promise<string> {
    if (!locator) {
      throw new Error(
        `ExecuteStep failed: locator is null or undefined. Operation=${operation}`,
      );
    }

    const timeout = options.timeout ?? this.defaultTimeout;

    const highlight = options.highlight ?? true;

    const screenshotOnFailure = options.screenshotOnFailure ?? true;

    try {
      await locator.waitFor({
        state: "attached",
        timeout,
      });

      if (highlight) {
        await this.highlightElement(locator);
      }

      switch (operation) {
        case UIOps.Set:
          return await this.handleSet(locator, data, timeout);

        case UIOps.Read:
          return await this.handleRead(locator);

        case UIOps.Verify:
          return await this.handleVerify(locator, data);

        case UIOps.Click:
          await locator.click({ timeout });
          return "";

        case UIOps.Check:
          await locator.check({ timeout });
          return "";

        case UIOps.Uncheck:
          await locator.uncheck({ timeout });
          return "";

        case UIOps.Select:
          await this.select(locator, data, timeout);
          return "";

        case UIOps.Clear:
          await locator.clear({ timeout });
          return "";

        case UIOps.Hover:
          await locator.hover({ timeout });
          return "";

        default:
          throw new Error(`Unsupported UI operation: ${operation}`);
      }
    } catch (error) {
      await this.handleFailure(
        locator,
        operation,
        data,
        error,
        screenshotOnFailure,
      );

      throw error;
    }
  }

  // ============================================================
  // SET
  // ============================================================

  private async handleSet(
    locator: Locator,
    data: string,
    timeout: number,
  ): Promise<string> {
    const metadata = await this.getElementMetadata(locator);

    switch (metadata.tag) {
      // -----------------------------------------------------
      // Standard input controls
      // -----------------------------------------------------

      case "input":
        switch (metadata.type) {
          case "checkbox":
            await this.setCheckbox(locator, data, timeout);
            break;

          case "radio":
            await locator.check({ timeout });
            break;

          case "button":
          case "submit":
          case "reset":
            await locator.click({
              timeout,
            });
            break;

          default:
            await locator.fill(data, { timeout });
            break;
        }

        break;

      // -----------------------------------------------------
      // Textarea
      // -----------------------------------------------------

      case "textarea":
        await locator.fill(data, { timeout });

        break;

      // -----------------------------------------------------
      // Native dropdown
      // -----------------------------------------------------

      case "select":
        await this.select(locator, data, timeout);

        break;

      // -----------------------------------------------------
      // Content Editable
      // -----------------------------------------------------

      default:
        if (metadata.contentEditable) {
          await locator.fill(data, { timeout });
        } else if (
          metadata.role === "combobox" ||
          metadata.role === "listbox"
        ) {
          await this.handleCustomDropdown(locator, data, timeout);
        } else {
          await locator.click({ timeout });
        }

        break;
    }

    return "";
  }

  // ============================================================
  // READ
  // ============================================================

  private async handleRead(locator: Locator): Promise<string> {
    const metadata = await this.getElementMetadata(locator);

    switch (metadata.tag) {
      case "input":
      case "textarea":
        return await locator.inputValue();

      case "select":
        return await locator.locator("option:checked").innerText();

      default:
        return (await locator.innerText()).trim();
    }
  }

  // ============================================================
  // VERIFY
  // ============================================================

  private async handleVerify(
    locator: Locator,
    expected: string,
  ): Promise<string> {
    const actual = await this.handleRead(locator);

    expect(
      actual.trim(),
      `Expected '${expected}' but received '${actual}'`,
    ).toBe(expected.trim());

    return actual;
  }

  // ============================================================
  // CLICK
  // ============================================================

 

  // ============================================================
  // CHECKBOX
  // ============================================================

  private async setCheckbox(
    locator: Locator,
    data: string,
    timeout: number,
  ): Promise<void> {
    const normalized = data.trim().toLowerCase();

    const shouldCheck = ["check", "checked", "true", "yes", "1"].includes(
      normalized,
    );

    await locator.setChecked(shouldCheck, { timeout });
  }

  // ============================================================
  // SELECT
  // ============================================================

  private async select(
    locator: Locator,
    data: string,
    timeout: number,
  ): Promise<void> {
    await locator.selectOption(
      {
        label: data,
      },
      {
        timeout,
      },
    );
  }

  // ============================================================
  // CUSTOM DROPDOWN
  // ============================================================

  private async handleCustomDropdown(
    locator: Locator,
    value: string,
    timeout: number,
  ): Promise<void> {
    await locator.click({
      timeout,
    });

    const option = this.page
      .getByRole("option", {
        name: value,
        exact: true,
      })
      .last();

    await option.waitFor({
      state: "visible",
      timeout,
    });

    await option.click({
      timeout,
    });
  }

  // ============================================================
  // ELEMENT METADATA
  // ============================================================

  private async getElementMetadata(locator: Locator): Promise<ElementMetadata> {
    return await locator.evaluate((element) => {
      const htmlElement = element as HTMLElement;

      return {
        tag: element.tagName.toLowerCase(),

        type: (element.getAttribute("type") ?? "").toLowerCase(),

        role: (element.getAttribute("role") ?? "").toLowerCase(),

        contentEditable: htmlElement.isContentEditable,
      };
    });
  }

  // ============================================================
  // HIGHLIGHT
  // ============================================================

  private async highlightElement(locator: Locator): Promise<void> {
    try {
      await locator.evaluate((element) => {
        const htmlElement = element as HTMLElement;

        const originalOutline = htmlElement.style.outline;

        htmlElement.style.outline = "3px solid red";

        setTimeout(() => {
          htmlElement.style.outline = originalOutline;
        }, 500);
      });
    } catch {
      // Highlighting must never fail the test.
    }
  }

  // ============================================================
  // FAILURE HANDLING
  // ============================================================

  private async handleFailure(
    locator: Locator,
    operation: UIOps,
    data: string,
    error: unknown,
    screenshotOnFailure: boolean,
  ): Promise<void> {
    const message = error instanceof Error ? error.message : String(error);

    console.error(`[WebActions] ${operation} failed`);

    console.error(`Data: ${data}`);

    console.error(`Error: ${message}`);

    try {
      console.error(`Locator: ${locator.toString()}`);
    } catch {
      // Ignore locator serialization error.
    }

    if (!screenshotOnFailure) {
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      await this.page.screenshot({
        path: `screenshots/failure-${operation}-${timestamp}.png`,
        fullPage: true,
      });
    } catch (screenshotError) {
      console.error("Unable to capture failure screenshot:", screenshotError);
    }
  }
}

interface ElementMetadata {
  tag: string;
  type: string;
  role: string;
  contentEditable: boolean;
}
