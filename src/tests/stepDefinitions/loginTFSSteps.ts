import { Given, When, Then, DataTable } from '@cucumber/cucumber';
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
    // Header row + one value row (the outline fills in the current iteration's values)
    const [{ UserName, Password }] = dataTable.hashes();
    await this.POManager.LoginTFSPage.enterUsername(UserName);
    await this.POManager.LoginTFSPage.enterPassword(Password);
  },
);


When("User Clicks Sign In Button", async function (this: ICustomWorld) {
  await this.POManager.LoginTFSPage.submit();
});

Then(
  "user profile menu is visible on page",
  async function (this: ICustomWorld) {
    await this.POManager.LoginTFSPage.verifyUserLoggedIn();
  },
);