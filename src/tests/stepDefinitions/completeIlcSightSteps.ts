import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from "../../Framework/support/world";

Given("I open the Login Page", async function (this: ICustomWorld) {
  await this.POManager.LoginPage.open();
});

When("I enter {string} in username on Login Page", async function (this: ICustomWorld, username: string) {
  await this.POManager.LoginPage.enterUsername(username);
});

When("I enter {string} in password on Login Page", async function (this: ICustomWorld, password: string) {
  await this.POManager.LoginPage.enterPassword(password);
});

When("I click on sign in button on Login Page", async function (this: ICustomWorld) {
  await this.POManager.LoginPage.submit();
});

When("I click on letter of credit button on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.clickLetterOfCredit();
});

When("I click on create link on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.openCreate();
});

When("I select {string} from product type on Ilc Sight Page", async function (this: ICustomWorld, productType: string) {
  await this.POManager.ilcSightPage.selectProductType(productType);
});

When("I enter {string} in applicant reference on Ilc Sight Page", async function (this: ICustomWorld, applicantReference: string) {
  await this.POManager.ilcSightPage.enterApplicantReference(applicantReference);
});

When("I click on fetch button on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.clickFetch();
});

When("I enter {string} in application date on Ilc Sight Page", async function (this: ICustomWorld, applicationDate: string) {
  await this.POManager.ilcSightPage.enterApplicationDate(applicationDate);
});

When("I select {string} from transfer method on Ilc Sight Page", async function (this: ICustomWorld, transferMethod: string) {
  await this.POManager.ilcSightPage.selectTransferMethod(transferMethod);
});

When("I enter {string} in expiry date on Ilc Sight Page", async function (this: ICustomWorld, expiryDate: string) {
  await this.POManager.ilcSightPage.enterExpiryDate(expiryDate);
});

When("I select {string} from confirmation on Ilc Sight Page", async function (this: ICustomWorld, confirmation: string) {
  await this.POManager.ilcSightPage.selectConfirmation(confirmation);
});

When("I check transferable on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.checkTransferable();
});

When("I check revolving on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.checkRevolving();
});

When("I enter {string} in expiry place on Ilc Sight Page", async function (this: ICustomWorld, expiryPlace: string) {
  await this.POManager.ilcSightPage.enterExpiryPlace(expiryPlace);
});

When("I select {string} from beneficiary bank on Ilc Sight Page", async function (this: ICustomWorld, beneficiaryBank: string) {
  await this.POManager.ilcSightPage.selectBeneficiaryBank(beneficiaryBank);
});

When("I select {string} from beneficiary country on Ilc Sight Page", async function (this: ICustomWorld, beneficiaryCountry: string) {
  await this.POManager.ilcSightPage.selectBeneficiaryCountry(beneficiaryCountry);
});

When("I enter {string} in beneficiary account on Ilc Sight Page", async function (this: ICustomWorld, beneficiaryAccount: string) {
  await this.POManager.ilcSightPage.enterBeneficiaryAccount(beneficiaryAccount);
});

When("I select {string} from advising bank on Ilc Sight Page", async function (this: ICustomWorld, advisingBank: string) {
  await this.POManager.ilcSightPage.selectAdvisingBank(advisingBank);
});

When("I enter {string} in amount on Ilc Sight Page", async function (this: ICustomWorld, amount: string) {
  await this.POManager.ilcSightPage.enterAmount(amount);
});

When("I select {string} from currency on Ilc Sight Page", async function (this: ICustomWorld, currency: string) {
  await this.POManager.ilcSightPage.selectCurrency(currency);
});

When("I select {string} from tolerance type on Ilc Sight Page", async function (this: ICustomWorld, toleranceType: string) {
  await this.POManager.ilcSightPage.selectToleranceType(toleranceType);
});

When("I enter {string} in amount on Ilc Sight Page \\(interaction 2\\)", async function (this: ICustomWorld, amount: string) {
  await this.POManager.ilcSightPage.enterFieldK98ekgtAmount(amount);
});

When("I enter {string} in amount on Ilc Sight Page \\(interaction 3\\)", async function (this: ICustomWorld, amount: string) {
  await this.POManager.ilcSightPage.enterField3luf0l6Amount(amount);
});

When("I select {string} from available by on Ilc Sight Page", async function (this: ICustomWorld, availableBy: string) {
  await this.POManager.ilcSightPage.selectAvailableBy(availableBy);
});

When("I enter {string} in presentation period days on Ilc Sight Page", async function (this: ICustomWorld, presentationPeriodDays: string) {
  await this.POManager.ilcSightPage.enterPresentationPeriodDays(presentationPeriodDays);
});

When("I enter {string} in presentation period description on Ilc Sight Page", async function (this: ICustomWorld, presentationPeriodDescription: string) {
  await this.POManager.ilcSightPage.enterPresentationPeriodDescription(presentationPeriodDescription);
});

When("I select {string} from document send mode on Ilc Sight Page", async function (this: ICustomWorld, documentSendMode: string) {
  await this.POManager.ilcSightPage.selectDocumentSendMode(documentSendMode);
});

When("I enter {string} in goods description on Ilc Sight Page", async function (this: ICustomWorld, goodsDescription: string) {
  await this.POManager.ilcSightPage.enterGoodsDescription(goodsDescription);
});

When("I select {string} from margin form on Ilc Sight Page", async function (this: ICustomWorld, marginForm: string) {
  await this.POManager.ilcSightPage.selectMarginForm(marginForm);
});

When("I enter {string} in margin percent on Ilc Sight Page", async function (this: ICustomWorld, marginPercent: string) {
  await this.POManager.ilcSightPage.enterMarginPercent(marginPercent);
});

When("I select {string} from margin currency on Ilc Sight Page", async function (this: ICustomWorld, marginCurrency: string) {
  await this.POManager.ilcSightPage.selectMarginCurrency(marginCurrency);
});

When("I select {string} from margin account on Ilc Sight Page", async function (this: ICustomWorld, marginAccount: string) {
  await this.POManager.ilcSightPage.selectMarginAccount(marginAccount);
});

When("I select {string} from initiating branch on Ilc Sight Page", async function (this: ICustomWorld, initiatingBranch: string) {
  await this.POManager.ilcSightPage.selectInitiatingBranch(initiatingBranch);
});

When("I select {string} from processing branch on Ilc Sight Page", async function (this: ICustomWorld, processingBranch: string) {
  await this.POManager.ilcSightPage.selectProcessingBranch(processingBranch);
});

When("I click on add row button on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.clickAddRow();
});

When("I select {string} from type on Ilc Sight Page", async function (this: ICustomWorld, type: string) {
  await this.POManager.ilcSightPage.selectType(type);
});

When("I upload files {string} on attachments input on Ilc Sight Page", async function (this: ICustomWorld, fileName: string) {
  await this.POManager.ilcSightPage.clickAttachments(fileName);
});

When("I click on save button on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.clickSave();
});

When("I click on validate button on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.clickValidate();
});

When("I click on submit button on Ilc Sight Page", async function (this: ICustomWorld) {
  await this.POManager.ilcSightPage.submit();
});
