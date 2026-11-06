import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { UIOps } from "@/Framework/controls/appWrapper";
import { GlobalVariables } from "@/Framework/globalVariables";

export class InputPage extends BasePage {
  private readonly actionQueueButton: Locator;
  private readonly unassignedQueueLink: Locator;
  private readonly pickButton: Locator;
  private readonly myTaskLink: Locator;
  // private readonly ilcSightIm49787Button: Locator;
  private readonly applicableRulesDropdown: Locator;
  private readonly phrasesButton: Locator;
  private readonly searchByNameInput: Locator;
  private readonly automationPhraseButton: Locator;
  private readonly principalCifInput: Locator;
  private readonly fetchButton: Locator;
  private readonly adviseThroughBankDropdown: Locator;
  private readonly requestedConfirmationPartyButton: Locator;
  private readonly requestedConfirmationPartyDropdown: Locator;
  private readonly confirmationChargesPayableByDropdown: Locator;
  private readonly instructionsFromApplicantPhrasesButton: Locator;
  private readonly SelectPhraseInstructionsFromApplicant: Locator;
  private readonly instructionsToPayingAcceptingInput: Locator;
  private readonly revolvePeriodInput: Locator;
  private readonly revolveFrequencyDropdown: Locator;
  private readonly noOfTimesToRevolveInput: Locator;
  private readonly nextRevolveDateDropdown: Locator;
  private readonly revolvingTypeDropdown: Locator;
  private readonly noticeDaysInput: Locator;
  private readonly availableWithDropdown: Locator;
  private readonly cityInput: Locator;
  private readonly countryDropdown: Locator;
  private readonly overlayInput: Locator;
  private readonly shipmentFromInput: Locator;
  private readonly shipmentToInput: Locator;
  private readonly placeOfLoadingInput: Locator;
  private readonly destinationPlaceInput: Locator;
  private readonly partialShipmentDropdown: Locator;
  private readonly transhipmentDropdown: Locator;
  private readonly shipmentDateDropdown: Locator;
  private readonly shipmentPeriodInput: Locator;
  private readonly namedPlaceInput: Locator;
  private readonly incotermsDropdown: Locator;
  private readonly freightDropdown: Locator;
  private readonly modeOfShipmentDropdown: Locator;
  private readonly documentsInput: Locator;
  private readonly additionalConditionsInput: Locator;
  private readonly specialPaymentConditionsForBeneficiaryInput: Locator;
  private readonly specialPaymentConditionsForBankOnlyInput: Locator;
  private readonly chargeInput: Locator;
  private readonly ourChargesDropdown: Locator;
  private readonly overseasChargesDropdown: Locator;
  private readonly taxToBePaidByDropdown: Locator;
  private readonly chargeCurrencyDropdown: Locator;
  private readonly deferBeneficiaryChargesCheckbox: Locator;
  private readonly deferApplicantChargesCheckbox: Locator;
  private readonly collateralItemsAddRowButton: Locator;
  private readonly collateralCodeDropdown: Locator;
  private readonly descriptionInput: Locator;
  private readonly collateralAmountInput: Locator;
  private readonly saveButton: Locator;
  private readonly fxDealDropdown: Locator;
  private readonly reimbursingBankDropdown: Locator;
  // private readonly accountSelectAccountButton: Locator;
  private readonly accountDropdown: Locator;
  private readonly instructionsToReimbursingBankInput: Locator;
  private readonly chargesBorneByDropdown: Locator;
  private readonly reimbursingBankApplicableRulesDropdown: Locator;
  private readonly additionalPartyItemsAddRow: Locator;
  private readonly additionalPartiesDropdown: Locator;
  private readonly correspondingAdditionalPartyDropdown: Locator;
  private readonly additionalPartyItemSaveButton: Locator;
  private readonly additionalPartiesDropdown2: Locator;
  private readonly correspondingAdditionalPartyDropdown2: Locator;
  private readonly additionalPartyItemsSaveButton2: Locator;
  private readonly hsCodeItemsAddRowButton: Locator;
  private readonly hsCodeItemsHsCode: Locator;
  private readonly hsCodeQuantityInput: Locator;
  private readonly uomInput: Locator;
  private readonly hsCodeUnitPriceCurrencyDropdown: Locator;
  private readonly hsCodeUnitPriceInput: Locator;
  private readonly hsCodeMargingCurrencyDropdown: Locator;
  private readonly hsCodeMaringPriceInput: Locator;
  private readonly hsCodeCountryOfOriginDropdown: Locator;
  private readonly hsCodeGdNumberInput: Locator;
  private readonly useCheckbox: Locator;
  private readonly hsCodeItemsSaveButton: Locator;
  private readonly gdItemsAddRowButton: Locator;
  private readonly gdNoInput: Locator;
  private readonly gdCurrencyDropdown: Locator;
  private readonly gdAmountInput: Locator;
  private readonly gdDateDropdown: Locator;
  private readonly gdRealizationDate: Locator;
  private readonly realizationInput: Locator;
  private readonly insuranceCurrencyDropdown: Locator;
  private readonly insuranceAmountInput: Locator;
  private readonly freightCurrencyDropdown: Locator;
  private readonly freightAmountInput: Locator;
  private readonly usedCheckbox: Locator;
  private readonly gdItemsSaveButton: Locator;
  private readonly commentsInput: Locator;
  private readonly validateButton: Locator;
  private readonly financialsButton: Locator;
  private readonly closeButton: Locator;
  private readonly submitButton: Locator;
  private readonly authorizeButton: Locator;

  /**
   * Table row of the LC created on the ILC Sight page: finds ILC_SIGHT_REF_NUMB in the
   * reference column and walks up to its <tr>. Built on each use, so it always uses the
   * value stored at that moment. Locate cells from it, e.g. this.lcTask.getByTestId("table-action-pick").
   */
  private get lcTask(): Locator {
    const referenceNumber = GlobalVariables.ILC_SIGHT_REF_NUMB;
    if (!referenceNumber) {
      throw new Error(
        "ILC_SIGHT_REF_NUMB is not set. Run the ILC Sight scenario first.",
      );
    }
    return this.page
      .getByTestId("table-cell-entityCode")
      .or(this.page.getByTestId("table-cell-code"))
      .getByText(referenceNumber, { exact: true })
      .locator("xpath=ancestor::tr[@data-testid='table-row']");
  }

  public async isPageLoaded(): Promise<boolean> {
    await expect(this.actionQueueButton).toBeVisible({ timeout: 15000 });
    return true;
  }

  constructor(page: Page) {
    super(page);
    this.actionQueueButton = page.getByTestId("nav-ac-que");
    this.unassignedQueueLink = page.getByTestId("nav-ac-que-un-ass");
    this.pickButton = this.lcTask.getByTestId("table-action-pick");
    this.myTaskLink = page.getByTestId("nav-ac-que-my");
    this.applicableRulesDropdown = page
      .getByTestId("lc-field-applicableRulesCode-control")
      .getByRole("combobox");
    this.phrasesButton = page
      .getByTestId("lc-field-instructionsToAdvisingBank")
      .getByRole("button");
    this.searchByNameInput = page.getByTestId("table-search-control");
    this.automationPhraseButton = page
      .getByTestId("table-cell-name")
      .locator("span");
    this.principalCifInput = page.getByTestId("lc-field-principalCif-control");
    this.fetchButton = page.getByTestId("lc-field-principalCif-action");
    this.adviseThroughBankDropdown = page
      .getByTestId("lc-field-adviseThroughBankCode-control")
      .getByRole("combobox");
    this.requestedConfirmationPartyButton = page
      .getByTestId("lc-field-requestedConfirmationParty")
      .locator("label");
    this.requestedConfirmationPartyDropdown = page
      .getByTestId("lc-field-requestedConfirmationParty-control")
      .getByRole("combobox");
    this.confirmationChargesPayableByDropdown = page
      .getByTestId("lc-field-confirmationChargesPayableBy-control")
      .getByRole("combobox");
    this.instructionsFromApplicantPhrasesButton = page
      .getByTestId("lc-field-instructionsFromApplicant")
      .getByRole("button");
    this.SelectPhraseInstructionsFromApplicant =
      page.getByTestId("table-cell-name");
    this.instructionsToPayingAcceptingInput = page.getByTestId(
      "lc-field-instructionsToNegotiatingBank-control",
    );
    this.revolvePeriodInput = page
      .getByTestId("lc-field-revolvePeriod-control")
      .getByRole("spinbutton");
    this.revolveFrequencyDropdown = page
      .getByTestId("lc-field-revolveFrequencyCode-control")
      .getByRole("combobox");
    this.noOfTimesToRevolveInput = page
      .getByTestId("lc-field-noOfTimesToRevolve-control")
      .getByRole("spinbutton");
    this.nextRevolveDateDropdown = page
      .getByTestId("lc-field-nextRevolveDate-control")
      .getByRole("combobox");
    this.revolvingTypeDropdown = page
      .getByTestId("lc-field-revolvingTypeCode-control")
      .getByRole("combobox");
    this.noticeDaysInput = page
      .getByTestId("lc-field-noticeDays-control")
      .getByRole("spinbutton");
    this.availableWithDropdown = page
      .getByTestId("lc-field-availableWithCode-control")
      .getByRole("combobox");
    this.cityInput = page.getByTestId("lc-field-availableWithCity-control");
    this.countryDropdown = page
      .getByTestId("lc-field-availableWithCountryCode-control")
      .getByRole("combobox");
    this.overlayInput = page
      .getByTestId("lc-field-availableWithCountryCode-overlay")
      .getByRole("searchbox");
    this.shipmentFromInput = page.getByTestId("lc-field-shipmentFrom-control");
    this.shipmentToInput = page.getByTestId("lc-field-shipmentTo-control");
    this.placeOfLoadingInput = page.getByTestId(
      "lc-field-portPlaceOfLoading-control",
    );
    this.destinationPlaceInput = page.getByTestId(
      "lc-field-portPlaceOfDischarge-control",
    );
    this.partialShipmentDropdown = page
      .getByTestId("lc-field-partialShipments-control")
      .getByRole("combobox");
    this.transhipmentDropdown = page
      .getByTestId("lc-field-transshipments-control")
      .getByRole("combobox");
    this.shipmentDateDropdown = page
      .getByTestId("lc-field-latestShipmentsDate-control")
      .getByRole("combobox");
    this.shipmentPeriodInput = page.getByTestId(
      "lc-field-shipmentPeriod-control",
    );
    this.namedPlaceInput = page.getByTestId("lc-field-namedPlace-control");
    this.incotermsDropdown = page
      .getByTestId("lc-field-incoterms2020Code-control")
      .getByRole("combobox");
    this.freightDropdown = page
      .getByTestId("lc-field-freightCode-control")
      .getByRole("combobox");
    this.modeOfShipmentDropdown = page
      .getByTestId("lc-field-modeOfShipmentCode-control")
      .getByRole("combobox");
    this.documentsInput = page.getByTestId(
      "lc-field-documentsRequired-control",
    );
    this.additionalConditionsInput = page.getByTestId(
      "lc-field-additionalConditions-control",
    );
    this.specialPaymentConditionsForBeneficiaryInput = page.getByTestId(
      "lc-field-specialPaymentConditionsBeneficiary-control",
    );
    this.specialPaymentConditionsForBankOnlyInput = page.getByTestId(
      "lc-field-specialPaymentConditionsBankOnly-control",
    );
    this.chargeInput = page.getByTestId("lc-field-charges71B-control");
    this.ourChargesDropdown = page
      .getByTestId("lc-field-ourChargesCode-control")
      .getByRole("combobox");
    this.overseasChargesDropdown = page
      .getByTestId("lc-field-overseasChargesCode-control")
      .getByRole("combobox");
    this.taxToBePaidByDropdown = page
      .getByTestId("lc-field-taxToBePaidBy-control")
      .getByRole("combobox");
    this.chargeCurrencyDropdown = page
      .getByTestId("lc-field-chargeCurrency-control")
      .getByRole("combobox");
    this.deferBeneficiaryChargesCheckbox = page
      .getByTestId("lc-field-deferBeneficiaryCharges-control")
      .getByRole("switch");
    this.deferApplicantChargesCheckbox = page
      .getByTestId("lc-field-deferApplicantCharges-control")
      .getByRole("switch");
    this.collateralItemsAddRowButton = page.getByTestId(
      "lc-field-collateralItems-add",
    );
    this.collateralCodeDropdown = page
      .getByTestId("lc-field-collateralItems-1-COLLATERAL_CODE-control")
      .getByRole("combobox");
    this.descriptionInput = page.getByTestId(
      "lc-field-collateralItems-1-COLLATERAL_DESCRIPTION-control",
    );
    this.collateralAmountInput = page.getByTestId(
      "lc-field-collateralItems-1-COLLATERAL_AMOUNT-control",
    );
    this.saveButton = page.getByTestId("lc-field-collateralItems-1-save");
    this.fxDealDropdown = page
      .getByTestId("lc-field-fxDeal-control")
      .getByRole("combobox");
    this.reimbursingBankDropdown = page
      .getByTestId("lc-field-reImbBankSwiftBIC-control")
      .getByRole("combobox");
    // this.accountSelectAccountButton = page.locator(
    //   "div.lc-section-card.ng-star-inserted:nth-of-type(15) > div.lc-section-collapse.lc-section-collapse--open:nth-of-type(2) > div.lc-section-collapse__inner > div.lc-section-body > div.lc-field-grid > div.lc-field-item.lc-col-span-1:nth-of-type(4)",
    // );
    this.accountDropdown = page
      .getByTestId("lc-field-reimbursingBankAccountNumber-control")
      .getByRole("combobox");
    this.instructionsToReimbursingBankInput = page.getByTestId(
      "lc-field-instructionsToReimbursingBank-control",
    );
    this.chargesBorneByDropdown = page
      .getByTestId("lc-field-chargesBorneByCode-control")
      .getByRole("combobox");
    this.reimbursingBankApplicableRulesDropdown = page
      .getByTestId("lc-field-reimbursementApplicableRulesCode-control")
      .getByRole("combobox");
    this.additionalPartyItemsAddRow = page.getByTestId(
      "lc-field-additionalPartyItems-add",
    );
    this.additionalPartiesDropdown = page
      .getByTestId("lc-field-additionalPartyItems-1-ADDITIONAL_PARTY-control")
      .getByRole("combobox");
    this.correspondingAdditionalPartyDropdown = page
      .getByTestId(
        "lc-field-additionalPartyItems-1-CORRESPON_ADDITIONAL_PARTY-control",
      )
      .getByRole("combobox");
    this.additionalPartyItemSaveButton = page.getByTestId(
      "lc-field-additionalPartyItems-1-save",
    );
    this.additionalPartiesDropdown2 = page
      .getByTestId("lc-field-additionalPartyItems-2-ADDITIONAL_PARTY-control")
      .getByRole("combobox");
    this.correspondingAdditionalPartyDropdown2 = page
      .getByTestId(
        "lc-field-additionalPartyItems-2-CORRESPON_ADDITIONAL_PARTY-control",
      )
      .getByRole("combobox");
    this.additionalPartyItemsSaveButton2 = page.getByTestId(
      "lc-field-additionalPartyItems-2-save",
    );
    this.hsCodeItemsAddRowButton = page.getByTestId("lc-field-hsCodeItems-add");
    this.hsCodeItemsHsCode = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE-control")
      .getByRole("combobox");
    this.hsCodeQuantityInput = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_QTY-control")
      .getByRole("spinbutton");
    this.uomInput = page.getByTestId(
      "lc-field-hsCodeItems-1-HS_CODE_UOM-control",
    );
    this.hsCodeUnitPriceCurrencyDropdown = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_UNIT_CURRENCY-control")
      .getByRole("combobox");
    this.hsCodeUnitPriceInput = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_UNIT_PRICE-control")
      .getByRole("spinbutton");
    this.hsCodeMargingCurrencyDropdown = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_MARGIN_CURRENCY-control")
      .getByRole("combobox");
    this.hsCodeMaringPriceInput = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_MARGIN_PRICE-control")
      .getByRole("spinbutton");
    this.hsCodeCountryOfOriginDropdown = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_COUNTRY_OF_ORIGIN-control")
      .getByRole("combobox");
    this.hsCodeGdNumberInput = page.getByTestId(
      "lc-field-hsCodeItems-1-HS_CODE_GD_NUMBER-control",
    );
    this.useCheckbox = page
      .getByTestId("lc-field-hsCodeItems-1-HS_CODE_IN_USE-control")
      .getByRole("switch");
    this.hsCodeItemsSaveButton = page.getByTestId(
      "lc-field-hsCodeItems-1-save",
    );
    this.gdItemsAddRowButton = page.getByTestId("lc-field-gdItems-add");
    this.gdNoInput = page.getByTestId("lc-field-gdItems-1-GD_NO-control");
    this.gdCurrencyDropdown = page
      .getByTestId("lc-field-gdItems-1-GD_CURRENCY-control")
      .getByRole("combobox");
    this.gdAmountInput = page.getByTestId(
      "lc-field-gdItems-1-GD_AMOUNT-control",
    );
    this.gdDateDropdown = page
      .getByTestId("lc-field-gdItems-1-GD_DATE-control")
      .getByRole("combobox");
    this.gdRealizationDate = page
      .getByTestId("lc-field-gdItems-1-REALIZATION_DATE-control")
      .getByRole("combobox");
    this.realizationInput = page.getByTestId(
      "lc-field-gdItems-1-FUND_REALIZATION-control",
    );
    this.insuranceCurrencyDropdown = page
      .getByTestId("lc-field-gdItems-1-INSURANCE_CURRENCY-control")
      .getByRole("combobox");
    this.insuranceAmountInput = page.getByTestId(
      "lc-field-gdItems-1-INSURANCE_AMOUNT-control",
    );
    this.freightCurrencyDropdown = page
      .getByTestId("lc-field-gdItems-1-FREIGHT_CURRENCY-control")
      .getByRole("combobox");
    this.freightAmountInput = page.getByTestId(
      "lc-field-gdItems-1-FREIGHT_AMOUNT-control",
    );
    this.usedCheckbox = page
      .getByTestId("lc-field-gdItems-1-GD_USED-control")
      .getByRole("switch");
    this.gdItemsSaveButton = page.getByTestId("lc-field-gdItems-1-save");
    this.commentsInput = page.getByTestId("task-comment-control");
    this.validateButton = page.getByTestId("lc-button-VALIDATE");
    this.financialsButton = page.getByTestId("lc-button-financials");
    this.closeButton = page
      .getByTestId("ac-que-my-task-aWQ6NjU-dialog-button-close")
      .getByRole("button");
    this.submitButton = page.getByTestId("lc-button-SUBMIT");
    this.authorizeButton = page.getByTestId("lc-button-AUTHORIZE");
  }

  public async clickActionQueue(): Promise<void> {
    await this.appWrapper.executeStep(this.actionQueueButton, UIOps.Set);
  }

  public async openUnassignedQueue(): Promise<void> {
    await this.appWrapper.executeStep(this.unassignedQueueLink, UIOps.Set);
  }

  public async clickPickButton(): Promise<void> {
    await this.appWrapper.executeStep(this.pickButton, UIOps.Set);
  }

  public async openMyTask(): Promise<void> {
    await this.appWrapper.executeStep(this.myTaskLink, UIOps.Set);
  }

  public async clickOnMyLC(): Promise<void> {
    await this.appWrapper.executeStep(this.lcTask, UIOps.Set);
  }

  public async selectApplicableRules(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.applicableRulesDropdown,
      UIOps.Set,
      value,
    );
  }

  public async clickPhrases(): Promise<void> {
    await this.appWrapper.executeStep(this.phrasesButton, UIOps.Set);
  }

  public async enterSearchByName(searchByName: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.searchByNameInput,
      UIOps.Set,
      searchByName,
    );
  }

  public async clickAutomationPhrase(): Promise<void> {
    await this.appWrapper.waitForPageLoad();
    // The search filters the table by API; wait until it narrows down to the single matching row
    await this.waitForCount(this.automationPhraseButton);
    await this.appWrapper.executeStep(this.automationPhraseButton, UIOps.Set);
  }

  public async enterPrincipalCif(principalCif: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.principalCifInput,
      UIOps.Set,
      principalCif,
    );
  }

  public async clickFetch(): Promise<void> {
    await this.appWrapper.executeStep(this.fetchButton, UIOps.Set);
  }

  public async selectAdviseThroughBank(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.adviseThroughBankDropdown,
      UIOps.Set,
      value,
    );
  }

  public async clickRequestedConfirmationParty(): Promise<void> {
    await this.appWrapper.executeStep(
      this.requestedConfirmationPartyButton,
      UIOps.Set,
    );
  }

  public async selectRequestedConfirmationParty(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.requestedConfirmationPartyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectConfirmationChargesPayableBy(
    value: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.confirmationChargesPayableByDropdown,
      UIOps.Set,
      value,
    );
  }

  public async clickInstructionsFromApplicantPhrasesButton(): Promise<void> {
    await this.appWrapper.executeStep(
      this.instructionsFromApplicantPhrasesButton,
      UIOps.Set,
    );
  }

  public async clickSelectPhraseInstructionsFromApplicant(): Promise<void> {
    await this.waitForCount(this.SelectPhraseInstructionsFromApplicant);
    await this.appWrapper.executeStep(
      this.SelectPhraseInstructionsFromApplicant,
      UIOps.Set,
    );
  }

  public async enterInstructionsToPayingAccepting(
    instructionsToPayingAccepting: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.instructionsToPayingAcceptingInput,
      UIOps.Set,
      instructionsToPayingAccepting,
    );
  }

  public async enterRevolvePeriod(revolvePeriod: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.revolvePeriodInput,
      UIOps.Set,
      revolvePeriod,
    );
  }

  public async selectRevolveFrequency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.revolveFrequencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterNoOfTimesToRevolve(
    noOfTimesToRevolve: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.noOfTimesToRevolveInput,
      UIOps.Set,
      noOfTimesToRevolve,
    );
  }

  public async enterNextRevolveDate(nextRevolveDate: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.nextRevolveDateDropdown,
      UIOps.Set,
      nextRevolveDate,
    );
  }

  public async selectRevolvingType(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.revolvingTypeDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterNoticeDays(noticeDays: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.noticeDaysInput,
      UIOps.Set,
      noticeDays,
    );
  }

  public async selectAvailableWith(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.availableWithDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterCity(city: string): Promise<void> {
    await this.appWrapper.executeStep(this.cityInput, UIOps.Set, city);
  }

  public async clickCountry(): Promise<void> {
    await this.appWrapper.executeStep(this.countryDropdown, UIOps.Set);
  }

  public async enterOverlay(overlay: string): Promise<void> {
    await this.appWrapper.executeStep(this.overlayInput, UIOps.Set, overlay);
  }

  public async selectCountry(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.countryDropdown, UIOps.Set, value);
  }

  public async enterShipmentFrom(shipmentFrom: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.shipmentFromInput,
      UIOps.Set,
      shipmentFrom,
    );
  }

  public async enterShipmentTo(shipmentTo: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.shipmentToInput,
      UIOps.Set,
      shipmentTo,
    );
  }

  public async enterPlaceOfLoading(placeOfLoading: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.placeOfLoadingInput,
      UIOps.Set,
      placeOfLoading,
    );
  }

  public async enterDestinationPlace(destinationPlace: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.destinationPlaceInput,
      UIOps.Set,
      destinationPlace,
    );
  }

  public async selectPartialShipment(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.partialShipmentDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectTranshipment(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.transhipmentDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterShipmentDate(shipmentDate: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.shipmentDateDropdown,
      UIOps.Set,
      shipmentDate,
    );
  }

  public async enterShipmentPeriod(shipmentPeriod: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.shipmentPeriodInput,
      UIOps.Set,
      shipmentPeriod,
    );
  }

  public async enterNamedPlace(namedPlace: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.namedPlaceInput,
      UIOps.Set,
      namedPlace,
    );
  }

  public async selectIncoterms(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.incotermsDropdown, UIOps.Set, value);
  }

  public async selectFreight(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.freightDropdown, UIOps.Set, value);
  }

  public async selectModeOfShipment(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.modeOfShipmentDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterDocuments(documents: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.documentsInput,
      UIOps.Set,
      documents,
    );
  }

  public async enterAdditionalConditions(
    additionalConditions: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.additionalConditionsInput,
      UIOps.Set,
      additionalConditions,
    );
  }

  public async enterSpecialPaymentConditionsForBeneficiary(
    specialPaymentConditionsForBeneficiary: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.specialPaymentConditionsForBeneficiaryInput,
      UIOps.Set,
      specialPaymentConditionsForBeneficiary,
    );
  }

  public async enterSpecialPaymentConditionsForBankOnly(
    specialPaymentConditionsForBankOnly: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.specialPaymentConditionsForBankOnlyInput,
      UIOps.Set,
      specialPaymentConditionsForBankOnly,
    );
  }

  public async enterCharge(charge: string): Promise<void> {
    await this.appWrapper.executeStep(this.chargeInput, UIOps.Set, charge);
  }

  public async selectOurCharges(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.ourChargesDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectOverseasCharges(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.overseasChargesDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectTaxToBePaidBy(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.taxToBePaidByDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectChargeCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.chargeCurrencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async checkDeferBeneficiaryCharges(): Promise<void> {
    await this.appWrapper.executeStep(
      this.deferBeneficiaryChargesCheckbox,
      UIOps.Set,
    );
  }

  public async checkDeferApplicantCharges(): Promise<void> {
    await this.appWrapper.executeStep(
      this.deferApplicantChargesCheckbox,
      UIOps.Set,
    );
  }

  public async clickCollateralItemsAddRowButton(): Promise<void> {
    await this.appWrapper.executeStep(
      this.collateralItemsAddRowButton,
      UIOps.Set,
    );
  }

  public async selectCollateralCode(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.collateralCodeDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterDescription(description: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.descriptionInput,
      UIOps.Set,
      description,
    );
  }

  public async enterCollateralAmount(collateralAmount: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.collateralAmountInput,
      UIOps.Set,
      collateralAmount,
    );
  }

  public async clickSave(): Promise<void> {
    await this.appWrapper.executeStep(this.saveButton, UIOps.Set);
  }

  public async selectFxDeal(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.fxDealDropdown, UIOps.Set, value);
  }

  public async selectReimbursingBank(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.reimbursingBankDropdown,
      UIOps.Set,
      value,
    );
  }

  // public async clickAccountSelectAccount(): Promise<void> {
  //   await this.appWrapper.executeStep(
  //     this.accountSelectAccountButton,
  //     UIOps.Set,
  //   );
  // }

  public async selectAccount(value: string): Promise<void> {
    await this.appWrapper.executeStep(this.accountDropdown, UIOps.Set, value);
  }

  public async enterInstructionsToReimbursingBank(
    instructionsToReimbursingBank: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.instructionsToReimbursingBankInput,
      UIOps.Set,
      instructionsToReimbursingBank,
    );
  }

  public async selectChargesBorneBy(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.chargesBorneByDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectReimbursingBankApplicableRules(
    value: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.reimbursingBankApplicableRulesDropdown,
      UIOps.Set,
      value,
    );
  }

  public async clickAdditionalPartyItemsAddRow(): Promise<void> {
    await this.appWrapper.executeStep(
      this.additionalPartyItemsAddRow,
      UIOps.Set,
    );
  }

  public async selectAdditionalParties(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.additionalPartiesDropdown,
      UIOps.Set,
      value,
    );
  }

  public async selectCorrespondingAdditionalParty(
    value: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.correspondingAdditionalPartyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async clickAdditionalPartyItemSaveButton(): Promise<void> {
    await this.appWrapper.executeStep(
      this.additionalPartyItemSaveButton,
      UIOps.Set,
    );
  }

  public async selectAdditionalPartiesDropdown2(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.additionalPartiesDropdown2,
      UIOps.Set,
      value,
    );
  }

  public async selectCorrespondingAdditionalPartyDropdown2(
    value: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.correspondingAdditionalPartyDropdown2,
      UIOps.Set,
      value,
    );
  }

  public async clickAdditionalPartyItemsSaveButton2(): Promise<void> {
    await this.appWrapper.executeStep(
      this.additionalPartyItemsSaveButton2,
      UIOps.Set,
    );
  }

  public async clickHsCodeItemsAddRowButton(): Promise<void> {
    await this.appWrapper.executeStep(this.hsCodeItemsAddRowButton, UIOps.Set);
  }

  public async selectHsCodeItemsHsCode(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeItemsHsCode,
      UIOps.Set,
      value,
      { timeout: 120000 },
    );
  }

  public async enterHsCodeQuantity(hsCodeQuantity: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeQuantityInput,
      UIOps.Set,
      hsCodeQuantity,
    );
  }

  public async enterUom(uom: string): Promise<void> {
    await this.appWrapper.executeStep(this.uomInput, UIOps.Set, uom);
  }

  public async selectHsCodeUnitPriceCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeUnitPriceCurrencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterHsCodeUnitPrice(hsCodeUnitPrice: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeUnitPriceInput,
      UIOps.Set,
      hsCodeUnitPrice,
    );
  }

  public async selectHsCodeMargingCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeMargingCurrencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterHsCodeMaringPrice(
    hsCodeMaringPrice: string,
  ): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeMaringPriceInput,
      UIOps.Set,
      hsCodeMaringPrice,
    );
  }

  public async selectHsCodeCountryOfOrigin(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeCountryOfOriginDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterHsCodeGdNumber(hsCodeGdNumber: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.hsCodeGdNumberInput,
      UIOps.Set,
      hsCodeGdNumber,
    );
  }

  public async checkUse(): Promise<void> {
    await this.appWrapper.executeStep(this.useCheckbox, UIOps.Set);
  }

  public async clickHsCodeItemsSaveButton(): Promise<void> {
    await this.appWrapper.executeStep(this.hsCodeItemsSaveButton, UIOps.Set);
  }

  public async clickGdItemsAddRowButton(): Promise<void> {
    await this.appWrapper.executeStep(this.gdItemsAddRowButton, UIOps.Set);
  }

  public async enterGdNo(gdNo: string): Promise<void> {
    await this.appWrapper.executeStep(this.gdNoInput, UIOps.Set, gdNo);
  }

  public async selectGdCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.gdCurrencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterGdAmount(gdAmount: string): Promise<void> {
    await this.appWrapper.executeStep(this.gdAmountInput, UIOps.Set, gdAmount);
  }

  public async enterGdDate(date: string): Promise<void> {
    await this.appWrapper.executeStep(this.gdDateDropdown, UIOps.Set, date);
  }

  public async enterGdRealizationDate(date: string): Promise<void> {
    await this.appWrapper.executeStep(this.gdRealizationDate, UIOps.Set, date);
  }

  public async enterRealization(realization: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.realizationInput,
      UIOps.Set,
      realization,
    );
  }

  public async selectInsuranceCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.insuranceCurrencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterInsuranceAmount(insuranceAmount: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.insuranceAmountInput,
      UIOps.Set,
      insuranceAmount,
    );
  }

  public async selectFreightCurrency(value: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.freightCurrencyDropdown,
      UIOps.Set,
      value,
    );
  }

  public async enterFreightAmount(freightAmount: string): Promise<void> {
    await this.appWrapper.executeStep(
      this.freightAmountInput,
      UIOps.Set,
      freightAmount,
    );
  }

  public async checkUsed(): Promise<void> {
    await this.appWrapper.executeStep(this.usedCheckbox, UIOps.Set);
  }

  public async clickGdItemsSaveButton(): Promise<void> {
    await this.appWrapper.executeStep(this.gdItemsSaveButton, UIOps.Set);
  }

  public async enterComments(comments: string): Promise<void> {
    await this.appWrapper.executeStep(this.commentsInput, UIOps.Set, comments);
  }

  public async clickValidate(): Promise<void> {
    await this.appWrapper.executeStep(this.validateButton, UIOps.Set);
  }

  public async clickFinancials(): Promise<void> {
    await this.appWrapper.executeStep(this.financialsButton, UIOps.Set);
  }

  public async clickClose(): Promise<void> {
    await this.appWrapper.executeStep(this.closeButton, UIOps.Set);
  }

  public async submit(): Promise<void> {
    await this.appWrapper.executeStep(this.submitButton, UIOps.Set);
  }
  public async authorize(): Promise<void> {
    await this.appWrapper.executeStep(this.authorizeButton, UIOps.Set);
  }
}

export default InputPage;
