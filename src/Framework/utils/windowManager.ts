/**
 * Window Manager
 * Maximizes the browser window for browsers that have no "start maximized" option
 * (Firefox, WebKit). Chromium uses the --start-maximized launch flag instead.
 *
 * On Windows the real OS window is maximized through the Win32 API (via PowerShell).
 * On other platforms the page is sized to the screen as a best effort.
 */

import { execFileSync } from 'child_process';
import { Page } from '@playwright/test';
import Logger from './logger';

// Finds visible top-level windows whose title contains the marker and maximizes them (SW_MAXIMIZE = 3)
const MAXIMIZE_SCRIPT = `
$ProgressPreference = 'SilentlyContinue'
Add-Type @"
using System; using System.Runtime.InteropServices; using System.Text;
public class PwWindow {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc p, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int cmd);
  public static int Maximize(string marker) {
    int count = 0;
    EnumWindows((h, l) => {
      if (!IsWindowVisible(h)) return true;
      var title = new StringBuilder(512);
      GetWindowText(h, title, 512);
      if (title.ToString().Contains(marker)) { ShowWindow(h, 3); count++; }
      return true;
    }, IntPtr.Zero);
    return count;
  }
}
"@
# Some browsers (Firefox) update the window title with a delay, so keep looking for up to ~5s
$matched = 0
for ($i = 0; $i -lt 25 -and $matched -eq 0; $i++) {
  $matched = [PwWindow]::Maximize($env:PW_WINDOW_MARKER)
  if ($matched -eq 0) { Start-Sleep -Milliseconds 200 }
}
$matched`;

const ENCODED_SCRIPT = Buffer.from(MAXIMIZE_SCRIPT, 'utf16le').toString('base64');

/** Sizes the page to the available screen area (fallback when the OS window can't be maximized). */
async function fitPageToScreen(page: Page): Promise<void> {
    const screen = await page.evaluate(() => ({ width: window.screen.availWidth, height: window.screen.availHeight }));
    await page.setViewportSize(screen);
}

/**
 * Maximizes the window that hosts the page. Call right after newPage(), before navigating,
 * with the context created using `viewport: null` so the page follows the window size.
 */
export async function maximizeWindow(page: Page): Promise<void> {
    if (process.platform !== 'win32') {
        Logger.warn('Window maximize is only supported on Windows for this browser; sizing the page to the screen instead.');
        await fitPageToScreen(page);
        return;
    }

    // Give the window a unique title so we maximize this browser and not another one
    const marker = `pw-maximize-${process.pid}-${Date.now()}`;
    await page.evaluate(title => { document.title = title; }, marker);
    await page.waitForFunction(title => document.title === title, marker);

    try {
        const matched = execFileSync(
            'powershell',
            ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', ENCODED_SCRIPT],
            { env: { ...process.env, PW_WINDOW_MARKER: marker }, stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 },
        ).toString().trim();

        if (matched === '0') {
            throw new Error('browser window not found');
        }
    } catch (error) {
        Logger.warn(`Could not maximize the window (${error instanceof Error ? error.message : error}); sizing the page to the screen instead.`);
        await fitPageToScreen(page);
        return;
    }

    await page.evaluate(() => { document.title = ''; });
}
