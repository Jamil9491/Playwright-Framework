/**
 * Base Page Class
 * Provides common functionality for all page objects.
 * Follows the Page Object Model (POM) pattern.
 */

import { Page, Locator, expect } from "@playwright/test";
import Logger from "../utils/logger";
import { config } from "../config/config";
interface ElementMetadata {
  tag: string;
  type: string;
  role: string;
  contentEditable: boolean;
}
/**
 * Abstract base class for all page objects.
 * Contains common methods and properties that all pages should have.
 */
export abstract class BasePage {
  protected page: Page;
  protected logger: typeof Logger;
  protected config: typeof config;
  private readonly defaultTimeout: number;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger;
    this.config = config;
    this.defaultTimeout = Number(process.env.TIMEOUT ?? 30000);
  }


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
            this.logger.info(`Setting input: ${data}`);

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
        await  locator.selectOption(
          {
            label: data,
          },
          {
            timeout,
          },
        );

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
    this.logger.info(`Setting checkbox: ${normalized}`);

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
        this.logger.info(`Selecting option: ${data}`);

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
    this.logger.info(`Selecting option: ${value}`);

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


















  /**
   * Navigate to a specific URL.
   * @param url - The URL to navigate to (can be relative or absolute).
   */
  public async navigateTo(url: string): Promise<void> {
    const fullUrl = url.startsWith("http")
      ? url
      : `${this.config.BASE_URL}${url}`;
    this.logger.info(`Navigating to: ${fullUrl}`);
    await this.page.goto(fullUrl, { waitUntil: "domcontentloaded" });
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to load completely.
   */
  public async waitForPageLoad(): Promise<void> {
    this.logger.debug("Waiting for page to load...");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get the current page title.
   */
  public async getPageTitle(): Promise<string> {
    const title = await this.page.title();
    this.logger.debug(`Page title: ${title}`);
    return title;
  }

  /**
   * Get the current page URL.
   */
  public async getCurrentUrl(): Promise<string> {
    const url = this.page.url();
    this.logger.debug(`Current URL: ${url}`);
    return url;
  }

  /**
   * Click an element by locator.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async clickElement(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Clicking element: ${name}`);
    await locator.click();
  }

  /**
   * Fill text into an input field.
   * @param locator - The CSS locator of the input field.
   * @param text - The text to fill.
   * @param elementName - A friendly name for logging.
   */
  public async fillText(
    locator: Locator,
    text: string,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Filling text "${text}" into: ${name}`);
    await locator.fill(text);
  }

  /**
   * Clear and fill text into an input field.
   * @param locator - The CSS locator of the input field.
   * @param text - The text to fill.
   * @param elementName - A friendly name for logging.
   */
  public async clearAndFillText(
    locator: Locator,
    text: string,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Clearing and filling text "${text}" into: ${name}`);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content of an element.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async getElementText(
    locator: Locator,
    elementName?: string,
  ): Promise<string | null> {
    const name = elementName || locator;
    this.logger.debug(`Getting text from element: ${name}`);
    return await locator.textContent();
  }

  /**
   * Check if an element is visible.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async isElementVisible(
    locator: Locator,
    elementName?: string,
  ): Promise<boolean> {
    const name = elementName || locator;
    this.logger.debug(`Checking if element is visible: ${name}`);
    return await locator.isVisible();
  }

  public async waitForElementVisible(
    element: string | Locator,
    elementName?: string,
    timeout?: number,
  ): Promise<void> {
    const name =
      elementName || (typeof element === "string" ? element : "Locator");
    const locator =
      typeof element === "string" ? this.page.locator(element) : element;

    this.logger.info(`Waiting for element to be visible: ${name}`);
    await expect(locator).toBeVisible({ timeout });
  }
  public async waitForElementHidden(
    element: string | Locator,
    elementName?: string,
    timeout?: number,
  ): Promise<void> {
    const name =
      elementName || (typeof element === "string" ? element : "Locator");
    const locator =
      typeof element === "string" ? this.page.locator(element) : element;

    this.logger.info(`Waiting for element to be hidden: ${name}`);
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Assert that an element contains specific text.
   * @param locator - The CSS locator of the element.
   * @param expectedText - The expected text.
   * @param elementName - A friendly name for logging.
   */
  public async assertElementText(
    locator: Locator,
    expectedText: string,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(
      `Asserting element ${name} contains text: "${expectedText}"`,
    );
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Assert that an element has exact text.
   * @param locator - The CSS locator of the element.
   * @param expectedText - The expected exact text.
   * @param elementName - A friendly name for logging.
   */
  public async assertElementExactText(
    locator: Locator,
    expectedText: string,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(
      `Asserting element ${name} has exact text: "${expectedText}"`,
    );

    await expect(locator).toHaveText(expectedText);
  }

  /**
   * Assert that an element is visible.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async assertElementVisible(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Asserting element is visible: ${name}`);
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that an element is hidden.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async assertElementHidden(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Asserting element is hidden: ${name}`);
    await expect(locator).toBeHidden();
  }

  /**
   * Scroll to an element.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async scrollToElement(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Scrolling to element: ${name}`);
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Select an option from a dropdown.
   * @param locator - The CSS locator of the select element.
   * @param value - The value or label to select.
   * @param elementName - A friendly name for logging.
   */
  public async selectOption(
    locator: Locator,
    value: string,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Selecting option "${value}" from dropdown: ${name}`);
    await locator.selectOption({ label: value });
  }

  /**
   * Hover over an element.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async hoverElement(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Hovering over element: ${name}`);
    await locator.hover();
  }

  /**
   * Double-click an element.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async doubleClickElement(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Double-clicking element: ${name}`);
    await locator.dblclick();
  }

  /**
   * Right-click an element.
   * @param locator - The CSS locator of the element.
   * @param elementName - A friendly name for logging.
   */
  public async rightClickElement(
    locator: Locator,
    elementName?: string,
  ): Promise<void> {
    const name = elementName || locator;
    this.logger.info(`Right-clicking element: ${name}`);
    await locator.click({ button: "right" });
  }

  /**
   * Press a key or key combination.
   * @param key - The key or key combination to press.
   */
  public async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Take a screenshot of the current page.
   * @param name - Optional name for the screenshot file.
   */
  public async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    this.logger.info(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Wait for a network response.
   * @param urlPattern - The URL pattern to wait for.
   * @param status - Optional expected status code.
   */
  public async waitForResponse(
    urlPattern: string | RegExp,
    status?: number,
  ): Promise<void> {
    this.logger.info(
      `Waiting for response: ${urlPattern} ${status ? `with status ${status}` : ""}`,
    );
    await this.page.waitForResponse((response) => {
      const urlMatch =
        typeof urlPattern === "string"
          ? response.url().includes(urlPattern)
          : urlPattern.test(response.url());

      const statusMatch = status ? response.status() === status : true;

      return urlMatch && statusMatch;
    });
  }

  /**
   * Reload the current page.
   */
  public async reloadPage(): Promise<void> {
    this.logger.info("Reloading page...");
    await this.page.reload({ waitUntil: "domcontentloaded" });
  }

  /**
   * Go back in browser history.
   */
  public async goBack(): Promise<void> {
    this.logger.info("Going back in browser history...");
    await this.page.goBack({ waitUntil: "domcontentloaded" });
  }

  /**
   * Go forward in browser history.
   */
  public async goForward(): Promise<void> {
    this.logger.info("Going forward in browser history...");
    await this.page.goForward({ waitUntil: "domcontentloaded" });
  }

  /**
   * Get a locator for an element.
   * @param locator - The CSS locator of the element.
   */
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Abstract method that must be implemented by each page.
   * Should return true if the page is loaded correctly.
   */
  public abstract isPageLoaded(): Promise<boolean>;

  // FUNCTION:FOR CHECKING VALUE EXIST OR NOT

  public async checkFieldHasValue(locator: Locator): Promise<boolean> {
    let value: string | null;

    try {
      value = await locator.inputValue();
    } catch {
      value = await locator.textContent();
    }

    if (!value) return false;

    const trimmed = value.trim();
    if (!trimmed) return false;

    const lower = trimmed.toLowerCase();

    // Handle dropdown placeholder
    if (lower === "please select" || lower.includes("select")) {
      return false;
    }

    // Handle numeric values
    const numeric = parseFloat(trimmed.replace(/[^0-9.-]/g, ""));
    if (!isNaN(numeric)) {
      return numeric > 0;
    }

    return true;
  }

  // FUNCTION:FOR APPLYING INSERTION TO VERIFY VALID VALUE EXIST IN FIELD

  async expectFieldHasValue(locator: Locator) {
    let value: string | null;

    try {
      value = await locator.inputValue();
    } catch {
      value = await locator.textContent();
    }

    // Basic existence check
    expect(value, "Field has no value").toBeTruthy();

    const trimmed = value!.trim();

    expect(trimmed, "Field is empty or whitespace").not.toBe("");

    // 🚨 Dropdown placeholder validation
    const lower = trimmed.toLowerCase();
    expect(
      lower,
      `Dropdown still has placeholder value: "${trimmed}"`,
    ).not.toBe("please select");

    expect(
      lower,
      `Dropdown still has placeholder value: "${trimmed}"`,
    ).not.toContain("select"); // optional: covers "Select", "Please select", etc.

    // Remove currency symbols and formatting
    const numeric = parseFloat(trimmed.replace(/[^0-9.-]/g, ""));

    if (!isNaN(numeric)) {
      expect(
        numeric,
        `Expected amount to be greater than 0 but received ${numeric}`,
      ).toBeGreaterThan(0);
    } else {
      expect(
        trimmed.length,
        "Field contains no meaningful string",
      ).toBeGreaterThan(0);
    }
  }

  //FUNCTION:HANDLING THE EXECUTE STEP FUNCTIONALIT
}
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

export default BasePage;
