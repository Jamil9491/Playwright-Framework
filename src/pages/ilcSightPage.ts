import { expect, Locator, Page } from "@playwright/test";
import BasePage, { UIOps } from "./basePage";

export class IlcSightPage extends BasePage {
  private readonly letterOfCreditButton: Locator;
  private readonly createLink: Locator;
  private readonly productTypeDropdown: Locator;
  private readonly applicantReferenceInput: Locator;
  private readonly fetchButton: Locator;
  private readonly applicationDateDropdown: Locator;
  private readonly transferMethodDropdown: Locator;
  private readonly expiryDateDropdown: Locator;
  private readonly confirmationDropdown: Locator;
  private readonly transferableCheckbox: Locator;
  private readonly revolvingCheckbox: Locator;
  private readonly expiryPlaceInput: Locator;
  private readonly beneficiaryBankDropdown: Locator;
  private readonly beneficiaryCountryDropdown: Locator;
  private readonly beneficiaryAccountInput: Locator;
  private readonly advisingBankDropdown: Locator;
  private readonly currencyDropdown: Locator;
  private readonly amountInput: Locator;
  private readonly toleranceTypeDropdown: Locator;
  private readonly percentInput: Locator;
  private readonly fieldO8jls0gPercentInput: Locator;
  private readonly availableByDropdown: Locator;
  private readonly presentationPeriodDaysInput: Locator;
  private readonly presentationPeriodDescriptionInput: Locator;
  private readonly documentSendModeDropdown: Locator;
  private readonly goodsDescriptionInput: Locator;
  private readonly marginFormDropdown: Locator;
  private readonly marginPercentInput: Locator;
  private readonly marginCurrencyDropdown: Locator;
  private readonly marginAccountDropdown: Locator;
  private readonly initiatingBranchDropdown: Locator;
  private readonly processingBranchDropdown: Locator;
  private readonly validateButton: Locator;
  private readonly continueButton: Locator;
  private readonly submitButton: Locator;


  public async isPageLoaded(): Promise<boolean> {
    await expect(this.letterOfCreditButton).toBeVisible({ timeout: 15000 });
    return true;
  }

  constructor(page: Page) {
    super(page);
    this.letterOfCreditButton = page.getByTestId("nav-lc");
    this.createLink = page.getByTestId("nav-lc-create");
    this.productTypeDropdown = page.getByTestId("lc-field-productTypeCode-control").locator("span");
    this.applicantReferenceInput = page.getByTestId("lc-field-cifId-control");
    this.fetchButton = page.getByTestId("lc-field-cifId-action");
    this.applicationDateDropdown = page.getByTestId("lc-field-applicationDate-control").locator("input");
    this.transferMethodDropdown = page.getByTestId("lc-field-transferMethodCode-control").locator("span");
    this.expiryDateDropdown = page.getByTestId("lc-field-expiryDate-control").locator("input");
    this.confirmationDropdown = page.getByTestId("lc-field-confirmationInstructions-control").locator("span");
    this.transferableCheckbox = page.getByTestId("lc-field-transferable-control").locator("input");
    this.revolvingCheckbox = page.getByTestId("lc-field-revolving-control").locator("input");
    this.expiryPlaceInput = page.getByTestId("lc-field-expiryPlace-control");
    this.beneficiaryBankDropdown = page.getByTestId("lc-field-beneficiaryBankCode-control").locator("span");
    this.beneficiaryCountryDropdown = page.getByTestId("lc-field-beneficiaryCountry-control").locator("span");
    this.beneficiaryAccountInput = page.getByTestId("lc-field-beneficiaryAccountNumber-control");
    this.advisingBankDropdown = page.getByTestId("lc-field-advBankCode-control").locator("span");
    this.currencyDropdown = page.getByTestId("lc-field-currency-control").locator("span");
    this.amountInput = page.getByTestId("lc-field-amount-control");
    this.toleranceTypeDropdown = page.getByTestId("lc-field-toleranceType-control").locator("span");
    this.percentInput = page.getByTestId("lc-field-tolerancePlusPercent-control").locator("input");
    this.fieldO8jls0gPercentInput = page.getByTestId("lc-field-toleranceMinusPercent-control").locator("input");
    this.availableByDropdown = page.getByTestId("lc-field-availableByCode-control").locator("span");
    this.presentationPeriodDaysInput = page.getByTestId("lc-field-periodPresentation-control").locator("input");
    this.presentationPeriodDescriptionInput = page.getByTestId("lc-field-presentationPeriodDescription-control");
    this.documentSendModeDropdown = page.getByTestId("lc-field-documentSendModeCode-control").locator("span");
    this.goodsDescriptionInput = page.getByTestId("lc-field-goodsDescription-control");
    this.marginFormDropdown = page.getByTestId("lc-field-marginForm-control").locator("span");
    this.marginPercentInput = page.getByTestId("lc-field-margin-control").locator("input");
    this.marginCurrencyDropdown = page.getByTestId("lc-field-marginCurrency-control").locator("span");
    this.marginAccountDropdown = page.getByTestId("lc-field-marginAccountCode-control").locator("span");
    this.initiatingBranchDropdown = page.getByTestId("lc-field-initiatingBranchCode-control").locator("span");
    this.processingBranchDropdown = page.getByTestId("lc-field-processingBranchCode-control").locator("span");
    this.validateButton = page.getByTestId("lc-button-validate");
    this.continueButton = page.getByTestId("lc-create-dialog-button-continue").locator("button");
    this.submitButton = page.getByTestId("lc-button-submit");
  }

  public async clickLetterOfCredit(): Promise<void> {
    await this.executeStep(this.letterOfCreditButton, UIOps.Set);
  }

  public async openCreate(): Promise<void> {
    await this.executeStep(this.createLink, UIOps.Set);
  }

  public async selectProductType(value: string): Promise<void> {
    await this.executeStep(this.productTypeDropdown, UIOps.Set, value);
  }

  public async enterApplicantReference(applicantReference: string): Promise<void> {
    await this.executeStep(this.applicantReferenceInput, UIOps.Set, applicantReference);
  }

  public async clickFetch(): Promise<void> {
    await this.executeStep(this.fetchButton, UIOps.Set);
  }

  public async enterApplicationDate(applicationDate: string): Promise<void> {
    await this.executeStep(this.applicationDateDropdown, UIOps.Set, applicationDate);
  }

  public async selectTransferMethod(value: string): Promise<void> {
    await this.executeStep(this.transferMethodDropdown, UIOps.Set, value);
  }

  public async enterExpiryDate(expiryDate: string): Promise<void> {
    await this.executeStep(this.expiryDateDropdown, UIOps.Set, expiryDate);
  }

  public async selectConfirmation(value: string): Promise<void> {
    await this.executeStep(this.confirmationDropdown, UIOps.Set, value);
  }

  public async checkTransferable(): Promise<void> {
    await this.executeStep(this.transferableCheckbox, UIOps.Set);
  }

  public async checkRevolving(): Promise<void> {
    await this.executeStep(this.revolvingCheckbox, UIOps.Set);
  }

  public async enterExpiryPlace(expiryPlace: string): Promise<void> {
    await this.executeStep(this.expiryPlaceInput, UIOps.Set, expiryPlace);
  }

  public async selectBeneficiaryBank(value: string): Promise<void> {
    await this.executeStep(this.beneficiaryBankDropdown, UIOps.Set, value);
  }

  public async selectBeneficiaryCountry(value: string): Promise<void> {
    await this.executeStep(this.beneficiaryCountryDropdown, UIOps.Set, value);
  }

  public async enterBeneficiaryAccount(beneficiaryAccount: string): Promise<void> {
    await this.executeStep(this.beneficiaryAccountInput, UIOps.Set, beneficiaryAccount);
  }

  public async selectAdvisingBank(value: string): Promise<void> {
    await this.executeStep(this.advisingBankDropdown, UIOps.Set, value);
  }

  public async selectCurrency(value: string): Promise<void> {
    await this.executeStep(this.currencyDropdown, UIOps.Set, value);
  }

  public async enterAmount(amount: string): Promise<void> {
    await this.executeStep(this.amountInput, UIOps.Set, amount);
  }

  public async selectToleranceType(value: string): Promise<void> {
    await this.executeStep(this.toleranceTypeDropdown, UIOps.Set, value);
  }

  public async enterPercent(percent: string): Promise<void> {
    await this.executeStep(this.percentInput, UIOps.Set, percent);
  }

  public async enterFieldO8jls0gPercent(percent: string): Promise<void> {
    await this.executeStep(this.fieldO8jls0gPercentInput, UIOps.Set, percent);
  }

  public async selectAvailableBy(value: string): Promise<void> {
    await this.executeStep(this.availableByDropdown, UIOps.Set, value);
  }

  public async enterPresentationPeriodDays(presentationPeriodDays: string): Promise<void> {
    await this.executeStep(this.presentationPeriodDaysInput, UIOps.Set, presentationPeriodDays);
  }

  public async enterPresentationPeriodDescription(presentationPeriodDescription: string): Promise<void> {
    await this.executeStep(this.presentationPeriodDescriptionInput, UIOps.Set, presentationPeriodDescription);
  }

  public async selectDocumentSendMode(value: string): Promise<void> {
    await this.executeStep(this.documentSendModeDropdown, UIOps.Set, value);
  }

  public async enterGoodsDescription(goodsDescription: string): Promise<void> {
    await this.executeStep(this.goodsDescriptionInput, UIOps.Set, goodsDescription);
  }

  public async selectMarginForm(value: string): Promise<void> {
    await this.executeStep(this.marginFormDropdown, UIOps.Set, value);
  }

  public async enterMarginPercent(marginPercent: string): Promise<void> {
    await this.executeStep(this.marginPercentInput, UIOps.Set, marginPercent);
  }

  public async selectMarginCurrency(value: string): Promise<void> {
    await this.executeStep(this.marginCurrencyDropdown, UIOps.Set, value);
  }

  public async selectMarginAccount(value: string): Promise<void> {
    await this.executeStep(this.marginAccountDropdown, UIOps.Set, value);
  }

  public async selectInitiatingBranch(value: string): Promise<void> {
    await this.executeStep(this.initiatingBranchDropdown, UIOps.Set, value);
  }

  public async selectProcessingBranch(value: string): Promise<void> {
    await this.executeStep(this.processingBranchDropdown, UIOps.Set, value);
  }

  public async clickValidate(): Promise<void> {
    await this.executeStep(this.validateButton, UIOps.Set);
  }

  public async clickContinue(): Promise<void> {
    await this.executeStep(this.continueButton, UIOps.Set);
  }

  public async submit(): Promise<void> {
    await this.executeStep(this.submitButton, UIOps.Set);
  }
}

export default IlcSightPage;
