import { expect, Locator, Page } from '@playwright/test';
import BasePage, { UIOps } from './basePage';

export class DarazLoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    async isPageLoaded(): Promise<boolean> {
        await this.assertLoaded();
        return true;
    }

    constructor(page: Page) {
        super(page);
        // Verified against the Daraz Pakistan login modal, September 2026.
        this.usernameInput = page.getByPlaceholder('Please enter your Phone or Email', { exact: true });
        this.passwordInput = page.getByPlaceholder('Please enter your password', { exact: true });
        this.loginButton = page.getByRole('button', { name: 'LOGIN', exact: true });
    }

    async assertLoaded(): Promise<void> {
        await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
        await expect(this.passwordInput).toBeVisible();
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
        await expect(this.loginButton).toBeVisible();
    }

    async enterUsername(username: string): Promise<void> {
        // await this.fillText(this.usernameInput, username, 'Username Input');
        await this.executeStep(this.usernameInput, UIOps.Set, username);
    }

    async enterPassword(password: string): Promise<void> {
        // BasePage.fillText logs values, so use Playwright directly for credentials.
        // await this.passwordInput.fill(password);
        await this.executeStep(this.passwordInput, UIOps.Set, password);
    }

    async submit(): Promise<void> {
        await this.executeStep(this.loginButton, UIOps.Click);
    }

    async assertClosed(): Promise<void> {
        await this.waitForElementHidden(this.usernameInput, 'Username Input', 15000);
    }
}

export default DarazLoginPage;
