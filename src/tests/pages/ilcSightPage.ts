import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { UIOps } from "@/Framework/controls/appWrapper";

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
  private readonly amountInput: Locator;
  private readonly currencyDropdown: Locator;
  private readonly toleranceTypeDropdown: Locator;
  private readonly fieldK98ekgtAmountInput: Locator;
  private readonly field3luf0l6AmountInput: Locator;
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
  private readonly addRowButton: Locator;
  private readonly typeDropdown: Locator;
  private readonly attachmentsInput: Locator;
  private readonly saveButton: Locator;
  private readonly validateButton: Locator;
  private readonly submitButton: Locator;

  public async isPageLoaded(): Promise<boolean> {
    await expect(this.letterOfCreditButton).toBeVisible({ timeout: 15000 });
    return true;
  }

  constructor(page: Page) {
    super(page);
    this.letterOfCreditButton = page.getByTestId("nav-lc");
    this.createLink = page.getByTestId("nav-lc-create");
    this.productTypeDropdown = page
      .getByTestId("lc-field-productTypeCode-control")
      .getByRole("combobox");
    this.applicantReferenceInput = page.getByTestId("lc-field-cifId-control");
    this.fetchButton = page.getByTestId("lc-field-cifId-action");
    this.applicationDateDropdown = page
      .getByTestId("lc-field-applicationDate-control")
      .getByRole("combobox");
    this.transferMethodDropdown = page
      .getByTestId("lc-field-transferMethodCode-control")
      .getByRole("combobox");
    this.expiryDateDropdown = page
      .getByTestId("lc-field-expiryDate-control")
      .getByRole("combobox");
    this.confirmationDropdown = page
      .getByTestId("lc-field-confirmationInstructions-control")
      .getByRole("combobox");
    this.transferableCheckbox = page
      .getByTestId("lc-field-transferable-control")
      .getByRole("switch");
    this.revolvingCheckbox = page
      .getByTestId("lc-field-revolving-control")
      .getByRole("switch");
    this.expiryPlaceInput = page.getByTestId("lc-field-expiryPlace-control");
    this.beneficiaryBankDropdown = page
      .getByTestId("lc-field-beneficiaryBankCode-control")
      .getByRole("combobox");
    this.beneficiaryCountryDropdown = page
      .getByTestId("lc-field-beneficiaryCountry-control")
      .getByRole("combobox");
    this.beneficiaryAccountInput = page.getByTestId(
      "lc-field-beneficiaryAccountNumber-control",
    );
    this.advisingBankDropdown = page
      .getByTestId("lc-field-advBankCode-control")
      .getByRole("combobox");
    this.amountInput = page.getByTestId("lc-field-amount-control");
    this.currencyDropdown = page
      .getByTestId("lc-field-currency-control")
      .getByRole("combobox");
    this.toleranceTypeDropdown = page
      .getByTestId("lc-field-toleranceType-control")
      .getByRole("combobox");
    this.fieldK98ekgtAmountInput = page.getByTestId(
      "lc-field-tolerancePlusAmount-control",
    );
    this.field3luf0l6AmountInput = page.getByTestId(
      "lc-field-toleranceMinusAmount-control",
    );
    this.availableByDropdown = page
      .getByTestId("lc-field-availableByCode-control")
      .getByRole("combobox");
    this.presentationPeriodDaysInput = page
      .getByTestId("lc-field-periodPresentation-control")
      .getByRole("spinbutton");
    this.presentationPeriodDescriptionInput = page.getByTestId(
      "lc-field-presentationPeriodDescription-control",
    );
    this.documentSendModeDropdown = page
      .getByTestId("lc-field-documentSendModeCode-control")
      .getByRole("combobox");
    this.goodsDescriptionInput = page.getByTestId(
      "lc-field-goodsDescription-control",
    );
    this.marginFormDropdown = page
      .getByTestId("lc-field-marginForm-control")
      .getByRole("combobox");
    this.marginPercentInput = page
      .getByTestId("lc-field-margin-control")
      .getByRole("spinbutton");
    this.marginCurrencyDropdown = page
      .getByTestId("lc-field-marginCurrency-control")
      .getByRole("combobox");
    this.marginAccountDropdown = page
      .getByTestId("lc-field-marginAccountCode-control")
      .getByRole("combobox");
    this.initiatingBranchDropdown = page
      .getByTestId("lc-field-initiatingBranchCode-control")
      .getByRole("combobox");
    this.processingBranchDropdown = page
      .getByTestId("lc-field-processingBranchCode-control")
      .getByRole("combobox");
    this.addRowButton = page.getByTestId("lc-field-documents-add");
    this.typeDropdown = page
      .getByTestId("lc-field-documents-1-DOC_TYPE-control")
      .getByRole("combobox");
    this.attachmentsInput = page.getByTestId(
      "lc-field-documents-1-ATTACHMENTS-input",
    );
    this.saveButton = page.getByTestId("lc-field-documents-1-save");
    this.validateButton = page.getByTestId("lc-button-validate");
    this.submitButton = page.getByTestId("lc-button-submit");
  }

  public async clickLetterOfCredit(): Promise<void> {
    await this.appWrapper.executeStep(this.letterOfCreditButton, UIOps.Set);
  }

  public async openCreate(): Promise<void> {
    await this.appWrapper.executeStep(this.createLink, UIOps.Set);
  }

  public async selectProductType(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.productTypeDropdown, UIOps.Set, value);
  }

  public async enterApplicantReference(
    applicantReference: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.applicantReferenceInput,
      UIOps.Set,
      applicantReference,
    );
  }

  public async clickFetch(): Promise<void> {
    await this.appWrapper.executeStep(this.fetchButton, UIOps.Set);
  }

  public async enterApplicationDate(applicationDate: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.applicationDateDropdown,
      UIOps.Set,
      applicationDate,
    );
  }

  public async selectTransferMethod(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.transferMethodDropdown, UIOps.Set, value);
  }

  public async enterExpiryDate(expiryDate: string): Promise<void> {
    await this.appWrapper.executeStep(this.expiryDateDropdown, UIOps.Set, expiryDate);
  }

  public async selectConfirmation(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.confirmationDropdown, UIOps.Set, value);
  }

  public async checkTransferable(): Promise<void> {
    await this.appWrapper.executeStep(this.transferableCheckbox, UIOps.Set);
  }

  public async checkRevolving(): Promise<void> {
    await this.appWrapper.executeStep(this.revolvingCheckbox, UIOps.Set);
  }

  public async enterExpiryPlace(expiryPlace: string): Promise<void> {
    await this.appWrapper.executeStep(this.expiryPlaceInput, UIOps.Set, expiryPlace);
  }

  public async selectBeneficiaryBank(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.beneficiaryBankDropdown, UIOps.Set, value);
  }

  public async selectBeneficiaryCountry(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.beneficiaryCountryDropdown, UIOps.Set, value);
  }

  public async enterBeneficiaryAccount(
    beneficiaryAccount: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.beneficiaryAccountInput,
      UIOps.Set,
      beneficiaryAccount,
    );
  }

  public async selectAdvisingBank(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.advisingBankDropdown, UIOps.Set, value);
  }

  public async enterAmount(amount: string): Promise<void> {
    await this.appWrapper.executeStep(this.amountInput, UIOps.Set, amount);
  }

  public async selectCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.currencyDropdown, UIOps.Set, value);
  }

  public async selectToleranceType(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.toleranceTypeDropdown, UIOps.Set, value);
  }

  public async enterFieldK98ekgtAmount(amount: string): Promise<void> {
    await this.appWrapper.executeStep(this.fieldK98ekgtAmountInput, UIOps.Set, amount);
  }

  public async enterField3luf0l6Amount(amount: string): Promise<void> {
    await this.appWrapper.executeStep(this.field3luf0l6AmountInput, UIOps.Set, amount);
  }

  public async selectAvailableBy(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.availableByDropdown, UIOps.Set, value);
  }

  public async enterPresentationPeriodDays(
    presentationPeriodDays: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.presentationPeriodDaysInput,
      UIOps.Set,
      presentationPeriodDays,
    );
  }

  public async enterPresentationPeriodDescription(
    presentationPeriodDescription: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.presentationPeriodDescriptionInput,
      UIOps.Set,
      presentationPeriodDescription,
    );
  }

  public async selectDocumentSendMode(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.documentSendModeDropdown, UIOps.Set, value);
  }

  public async enterGoodsDescription(goodsDescription: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.goodsDescriptionInput,
      UIOps.Set,
      goodsDescription,
    );
  }

  public async selectMarginForm(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.marginFormDropdown, UIOps.Set, value);
  }

  public async enterMarginPercent(marginPercent: string): Promise<void> {
    await this.appWrapper.executeStep(this.marginPercentInput, UIOps.Set, marginPercent);
  }

  public async selectMarginCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.marginCurrencyDropdown, UIOps.Set, value);
  }

  public async selectMarginAccount(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.marginAccountDropdown, UIOps.Set, value);
  }

  public async selectInitiatingBranch(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.initiatingBranchDropdown, UIOps.Set, value);
  }

  public async selectProcessingBranch(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.processingBranchDropdown, UIOps.Set, value);
  }

  public async clickAddRow(): Promise<void> {
    await this.appWrapper.executeStep(this.addRowButton, UIOps.Set);
  }

  public async selectType(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.typeDropdown, UIOps.Set, value);
  }

  public async clickAttachments(fileName: string): Promise<void> {
    await this.appWrapper.executeStep(this.attachmentsInput, UIOps.Set, fileName);
  }

  public async clickSave(): Promise<void> {
    await this.appWrapper.executeStep(this.saveButton, UIOps.Set);
  }

  public async clickValidate(): Promise<void> {
    await this.appWrapper.executeStep(this.validateButton, UIOps.Set);
  }

  public async submit(): Promise<void> {
    await this.appWrapper.executeStep(this.submitButton, UIOps.Set);
  }
}

export default IlcSightPage;
