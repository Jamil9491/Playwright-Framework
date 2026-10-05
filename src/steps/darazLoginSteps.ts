import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';

// Environment references keep credentials out of Gherkin and report step names.
function credential(value: string): string {
    if (!value.startsWith('env:')) return value;
    const name = value.slice(4);
    const resolved = process.env[name];
    if (!resolved) throw new Error(`Set ${name} in .env or your terminal before running the Daraz login scenario.`);
    return resolved;
}

Given('I open the Daraz website', { timeout: 65000 }, async function (this: ICustomWorld) {
    await this.POManager.darazHomePage.open();
});

When('I open the Daraz login form', { timeout: 45000 }, async function (this: ICustomWorld) {
    await this.POManager.darazHomePage.openLogin();
    await this.POManager.DarazLoginPage.assertLoaded();
});

Then('the Daraz login form should be displayed', { timeout: 30000 }, async function (this: ICustomWorld) {
    await this.POManager.DarazLoginPage.assertLoaded();
});

When('I enter Daraz username {string}', { timeout: 35000 }, async function (this: ICustomWorld, username: string) {
    await this.POManager.DarazLoginPage.enterUsername(credential(username));
});

When('I enter Daraz password {string}', { timeout: 35000 }, async function (this: ICustomWorld, password: string) {
    await this.POManager.DarazLoginPage.enterPassword(credential(password));
});

When('I click the Daraz login button', { timeout: 35000 }, async function (this: ICustomWorld) {
    await this.POManager.DarazLoginPage.submit();
});

Then('I should be logged in to Daraz', { timeout: 65000 }, async function (this: ICustomWorld) {
    await this.POManager.darazHomePage.assertLoggedIn();
    await this.POManager.DarazLoginPage.assertClosed();
});
