import { ICustomWorld } from "../support/world";
import Logger from "./logger";
import fs from "fs";
import path from "path";

export class ScreenshotManager {
  /**
   * Saves a full-page screenshot under screenshots/ and attaches it to the report,
   * named "<name>.png". Never throws: a failed screenshot must not hide the real error.
   */
  static async capture(world: ICustomWorld, name: string = "screenshot") {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${name.replace(/[^a-z0-9_-]+/gi, "_")}-${timestamp}.png`;
    const filePath = path.join("screenshots", fileName);

    try {
      if (!fs.existsSync("screenshots"))
        fs.mkdirSync("screenshots", { recursive: true });

      const buffer = await world.page.screenshot({
        path: filePath,
        fullPage: true,
      });

      // Attach to Allure via Cucumber; fileName becomes the attachment name in the report
      await world.attach(buffer, { mediaType: "image/png", fileName: `${name}.png` });

      return filePath;
    } catch (error) {
      Logger.warn(
        `Could not capture screenshot: ${error instanceof Error ? error.message : error}`,
      );
      return undefined;
    }
  }

  /**
   * Full-page screenshot for screens that scroll inside a container (like the TFS LC page)
   * instead of the window, where fullPage alone only captures the visible part.
   * Temporarily lets each scrolled container and its parents grow to their full content
   * height, takes the screenshot, then restores the original styles. Never throws.
   */
  static async captureFullScreenshot(world: ICustomWorld, name: string = "full-page") {
    try {
      await world.page.evaluate(() => {
        const isScrolled = (el: HTMLElement) => {
          const { overflowY } = getComputedStyle(el);
          // "hidden" is left out on purpose: collapsed sections and ellipsis text must stay as they are
          return /(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight + 1;
        };
        const containers = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter(isScrolled);

        for (const container of containers) {
          for (let el: HTMLElement | null = container; el && el !== document.documentElement; el = el.parentElement) {
            if (el.hasAttribute("data-full-screenshot")) continue;
            // Keep the original inline style so it can be put back after the screenshot
            el.setAttribute("data-full-screenshot", el.getAttribute("style") ?? "");
            el.style.setProperty("height", "auto", "important");
            el.style.setProperty("max-height", "none", "important");
            el.style.setProperty("overflow", "visible", "important");
          }
        }
      });
    } catch (error) {
      Logger.warn(`Could not expand the page for a full screenshot: ${error instanceof Error ? error.message : error}`);
    }

    try {
      return await ScreenshotManager.capture(world, name);
    } finally {
      await world.page
        .evaluate(() => {
          document.querySelectorAll<HTMLElement>("[data-full-screenshot]").forEach((el) => {
            const original = el.getAttribute("data-full-screenshot");
            if (original) el.setAttribute("style", original);
            else el.removeAttribute("style");
            el.removeAttribute("data-full-screenshot");
          });
        })
        .catch(() => undefined);
    }
  }
}
