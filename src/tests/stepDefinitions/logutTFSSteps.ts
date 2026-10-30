import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from "../../Framework/support/world";

// Then("lo log log should be displayed on Logut TFS Page", async function (this: ICustomWorld) {
//   await this.POManager.logutTFSPage.assertLoLogLogVisible();
// });

When("I click on profile button on Page", async function (this: ICustomWorld) {
  await this.POManager.logutTFSPage.clickProfileButton();
});


When("I click on sign out button on Page", async function (this: ICustomWorld) {
  await this.POManager.logutTFSPage.logout();
});

Then("username field should be displayed on Page", async function (this: ICustomWorld) {
  await this.POManager.logutTFSPage.assertUsernameVisible();
});
