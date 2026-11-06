import { Given, When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../../Framework/support/world";
import { ScreenshotManager } from "@/Framework/utils/ScreenshotManager";
import globalVariables from "@/Framework/globalVariables";
import { expect } from "@playwright/test";

When(
  "I click on action queue button on Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickActionQueue();
  },
);

When(
  "I click on unassigned queue link on Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.openUnassignedQueue();
  },
);

When("I click on pick button on Page", async function (this: ICustomWorld) {
  await this.POManager.inputPage.clickPickButton();
});

When("I click on my task link on Page", async function (this: ICustomWorld) {
  await this.POManager.inputPage.openMyTask();
});

When("I open my LC on Page", async function (this: ICustomWorld) {
  await this.POManager.inputPage.clickOnMyLC();
});

When(
  "I select {string} from applicable rules on Input Page",
  async function (this: ICustomWorld, applicableRules: string) {
    await this.POManager.inputPage.selectApplicableRules(applicableRules);
  },
);

When(
  "I click on phrases button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickPhrases();
  },
);

When(
  "I enter {string} in search by name on Input Page",
  async function (this: ICustomWorld, searchByName: string) {
    await this.POManager.inputPage.enterSearchByName(searchByName);
  },
);

When(
  "I click on searched phrase on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickAutomationPhrase();
  },
);

When(
  "I enter {string} in principal cif on Input Page",
  async function (this: ICustomWorld, principalCif: string) {
    await this.POManager.inputPage.enterPrincipalCif(principalCif);
  },
);

When(
  "I click on fetch button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickFetch();
  },
);

When(
  "I select {string} from advise through bank on Input Page",
  async function (this: ICustomWorld, adviseThroughBank: string) {
    await this.POManager.inputPage.selectAdviseThroughBank(adviseThroughBank);
  },
);

When(
  "I click on requested confirmation party button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickRequestedConfirmationParty();
  },
);

When(
  "I select {string} from requested confirmation party on Input Page",
  async function (this: ICustomWorld, requestedConfirmationParty: string) {
    await this.POManager.inputPage.selectRequestedConfirmationParty(
      requestedConfirmationParty,
    );
  },
);

When(
  "I select {string} from confirmation charges payable by on Input Page",
  async function (this: ICustomWorld, confirmationChargesPayableBy: string) {
    await this.POManager.inputPage.selectConfirmationChargesPayableBy(
      confirmationChargesPayableBy,
    );
  },
);

When(
  "I click on phrases button on Input Page \\(interaction 2\\)",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickInstructionsFromApplicantPhrasesButton();
  },
);

When(
  "I click on automation phrase button on Input Page \\(interaction 2\\)",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickSelectPhraseInstructionsFromApplicant();
  },
);

When(
  "I enter {string} in instructions to paying accepting on Input Page",
  async function (this: ICustomWorld, instructionsToPayingAccepting: string) {
    await this.POManager.inputPage.enterInstructionsToPayingAccepting(
      instructionsToPayingAccepting,
    );
  },
);

When(
  "I enter {string} in revolve period on Input Page",
  async function (this: ICustomWorld, revolvePeriod: string) {
    await this.POManager.inputPage.enterRevolvePeriod(revolvePeriod);
  },
);

When(
  "I select {string} from revolve frequency on Input Page",
  async function (this: ICustomWorld, revolveFrequency: string) {
    await this.POManager.inputPage.selectRevolveFrequency(revolveFrequency);
  },
);

When(
  "I enter {string} in no of times to revolve on Input Page",
  async function (this: ICustomWorld, noOfTimesToRevolve: string) {
    await this.POManager.inputPage.enterNoOfTimesToRevolve(noOfTimesToRevolve);
  },
);

When(
  "I enter {string} in next revolve date on Input Page",
  async function (this: ICustomWorld, nextRevolveDate: string) {
    await this.POManager.inputPage.enterNextRevolveDate(nextRevolveDate);
  },
);

When(
  "I select {string} from revolving type on Input Page",
  async function (this: ICustomWorld, revolvingType: string) {
    await this.POManager.inputPage.selectRevolvingType(revolvingType);
  },
);

When(
  "I enter {string} in notice days on Input Page",
  async function (this: ICustomWorld, noticeDays: string) {
    await this.POManager.inputPage.enterNoticeDays(noticeDays);
  },
);

When(
  "I select {string} from available with on Input Page",
  async function (this: ICustomWorld, availableWith: string) {
    await this.POManager.inputPage.selectAvailableWith(availableWith);
  },
);

When(
  "I enter {string} in city on Input Page",
  async function (this: ICustomWorld, city: string) {
    await this.POManager.inputPage.enterCity(city);
  },
);

When(
  "I click on country dropdown on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickCountry();
  },
);

When(
  "I enter {string} in overlay on Input Page",
  async function (this: ICustomWorld, overlay: string) {
    await this.POManager.inputPage.enterOverlay(overlay);
  },
);

When(
  "I select {string} from country on Input Page",
  async function (this: ICustomWorld, country: string) {
    await this.POManager.inputPage.selectCountry(country);
  },
);

When(
  "I enter {string} in shipment from on Input Page",
  async function (this: ICustomWorld, shipmentFrom: string) {
    await this.POManager.inputPage.enterShipmentFrom(shipmentFrom);
  },
);

When(
  "I enter {string} in shipment to on Input Page",
  async function (this: ICustomWorld, shipmentTo: string) {
    await this.POManager.inputPage.enterShipmentTo(shipmentTo);
  },
);

When(
  "I enter {string} in place of loading on Input Page",
  async function (this: ICustomWorld, placeOfLoading: string) {
    await this.POManager.inputPage.enterPlaceOfLoading(placeOfLoading);
  },
);

When(
  "I enter {string} in destination place on Input Page",
  async function (this: ICustomWorld, destinationPlace: string) {
    await this.POManager.inputPage.enterDestinationPlace(destinationPlace);
  },
);

When(
  "I select {string} from partial shipment on Input Page",
  async function (this: ICustomWorld, partialShipment: string) {
    await this.POManager.inputPage.selectPartialShipment(partialShipment);
  },
);

When(
  "I select {string} from transhipment on Input Page",
  async function (this: ICustomWorld, transhipment: string) {
    await this.POManager.inputPage.selectTranshipment(transhipment);
  },
);

When(
  "I enter {string} in shipment date on Input Page",
  async function (this: ICustomWorld, shipmentDate: string) {
    await this.POManager.inputPage.enterShipmentDate(shipmentDate);
  },
);

When(
  "I enter {string} in shipment period on Input Page",
  async function (this: ICustomWorld, shipmentPeriod: string) {
    await this.POManager.inputPage.enterShipmentPeriod(shipmentPeriod);
  },
);

When(
  "I enter {string} in named place on Input Page",
  async function (this: ICustomWorld, namedPlace: string) {
    await this.POManager.inputPage.enterNamedPlace(namedPlace);
  },
);

When(
  "I select {string} from incoterms on Input Page",
  async function (this: ICustomWorld, incoterms: string) {
    await this.POManager.inputPage.selectIncoterms(incoterms);
  },
);

When(
  "I select {string} from freight on Input Page",
  async function (this: ICustomWorld, freight: string) {
    await this.POManager.inputPage.selectFreight(freight);
  },
);

When(
  "I select {string} from mode of shipment on Input Page",
  async function (this: ICustomWorld, modeOfShipment: string) {
    await this.POManager.inputPage.selectModeOfShipment(modeOfShipment);
  },
);

When(
  "I enter {string} in documents on Input Page",
  async function (this: ICustomWorld, documents: string) {
    await this.POManager.inputPage.enterDocuments(documents);
  },
);

When(
  "I enter {string} in additional conditions on Input Page",
  async function (this: ICustomWorld, additionalConditions: string) {
    await this.POManager.inputPage.enterAdditionalConditions(
      additionalConditions,
    );
  },
);

When(
  "I enter {string} in special payment conditions for beneficiary on Input Page",
  async function (
    this: ICustomWorld,
    specialPaymentConditionsForBeneficiary: string,
  ) {
    await this.POManager.inputPage.enterSpecialPaymentConditionsForBeneficiary(
      specialPaymentConditionsForBeneficiary,
    );
  },
);

When(
  "I enter {string} in special payment conditions for bank only on Input Page",
  async function (
    this: ICustomWorld,
    specialPaymentConditionsForBankOnly: string,
  ) {
    await this.POManager.inputPage.enterSpecialPaymentConditionsForBankOnly(
      specialPaymentConditionsForBankOnly,
    );
  },
);

When(
  "I enter {string} in charge on Input Page",
  async function (this: ICustomWorld, charge: string) {
    await this.POManager.inputPage.enterCharge(charge);
  },
);

When(
  "I select {string} from our charges on Input Page",
  async function (this: ICustomWorld, ourCharges: string) {
    await this.POManager.inputPage.selectOurCharges(ourCharges);
  },
);

When(
  "I select {string} from overseas charges on Input Page",
  async function (this: ICustomWorld, overseasCharges: string) {
    await this.POManager.inputPage.selectOverseasCharges(overseasCharges);
  },
);

When(
  "I select {string} from tax to be paid by on Input Page",
  async function (this: ICustomWorld, taxToBePaidBy: string) {
    await this.POManager.inputPage.selectTaxToBePaidBy(taxToBePaidBy);
  },
);

When(
  "I select {string} from charge currency on Input Page",
  async function (this: ICustomWorld, chargeCurrency: string) {
    await this.POManager.inputPage.selectChargeCurrency(chargeCurrency);
  },
);

When(
  "I check defer beneficiary charges on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.checkDeferBeneficiaryCharges();
  },
);

When(
  "I check defer applicant charges on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.checkDeferApplicantCharges();
  },
);

When(
  "I click on collateral Items add row button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickCollateralItemsAddRowButton();
  },
);

When(
  "I select {string} from collateral code on Input Page",
  async function (this: ICustomWorld, collateralCode: string) {
    await this.POManager.inputPage.selectCollateralCode(collateralCode);
  },
);

When(
  "I enter {string} in description on Input Page",
  async function (this: ICustomWorld, description: string) {
    await this.POManager.inputPage.enterDescription(description);
  },
);

When(
  "I enter {string} in collateral amount on Input Page",
  async function (this: ICustomWorld, collateralAmount: string) {
    await this.POManager.inputPage.enterCollateralAmount(collateralAmount);
  },
);

When(
  "I click on collateral Items save button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickSave();
  },
);

When(
  "I select {string} from fx deal on Input Page",
  async function (this: ICustomWorld, fxDeal: string) {
    await this.POManager.inputPage.selectFxDeal(fxDeal);
  },
);

When(
  "I select {string} from reimbursing bank on Input Page",
  async function (this: ICustomWorld, reimbursingBank: string) {
    await this.POManager.inputPage.selectReimbursingBank(reimbursingBank);
  },
);

// When(
//   "I click on account select account button on Input Page",
//   async function (this: ICustomWorld) {
//     await this.POManager.inputPage.clickAccountSelectAccount();
//   },
// );

When(
  "I select {string} from account on Input Page",
  async function (this: ICustomWorld, account: string) {
    await this.POManager.inputPage.selectAccount(account);
  },
);

When(
  "I enter {string} in instructions to reimbursing bank on Input Page",
  async function (this: ICustomWorld, instructionsToReimbursingBank: string) {
    await this.POManager.inputPage.enterInstructionsToReimbursingBank(
      instructionsToReimbursingBank,
    );
  },
);

When(
  "I select {string} from charges borne by on Input Page",
  async function (this: ICustomWorld, chargesBorneBy: string) {
    await this.POManager.inputPage.selectChargesBorneBy(chargesBorneBy);
  },
);

When(
  "I select {string} from reimbursing bank applicable rules on Input Page",
  async function (this: ICustomWorld, reimbursingBankApplicableRules: string) {
    await this.POManager.inputPage.selectReimbursingBankApplicableRules(
      reimbursingBankApplicableRules,
    );
  },
);

When(
  "I click on Additional Party Items add row button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickAdditionalPartyItemsAddRow();
  },
);

When(
  "I select {string} from additional parties on Input Page",
  async function (this: ICustomWorld, additionalParties: string) {
    await this.POManager.inputPage.selectAdditionalParties(additionalParties);
  },
);

When(
  "I select {string} from corresponding additional party on Input Page",
  async function (this: ICustomWorld, correspondingAdditionalParty: string) {
    await this.POManager.inputPage.selectCorrespondingAdditionalParty(
      correspondingAdditionalParty,
    );
  },
);

When(
  "I click on additional party items save button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickAdditionalPartyItemSaveButton();
  },
);

When(
  "I select {string} from additional parties on Input Page \\(interaction 2\\)",
  async function (this: ICustomWorld, additionalParties: string) {
    await this.POManager.inputPage.selectAdditionalPartiesDropdown2(
      additionalParties,
    );
  },
);

When(
  "I select {string} from corresponding additional party on Input Page \\(interaction 2\\)",
  async function (this: ICustomWorld, correspondingAdditionalParty: string) {
    await this.POManager.inputPage.selectCorrespondingAdditionalPartyDropdown2(
      correspondingAdditionalParty,
    );
  },
);

When(
  "I click on additional party items save button on Input Page \\(interaction 2\\)",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickAdditionalPartyItemsSaveButton2();
  },
);

When(
  "I click on hs code items add row button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickHsCodeItemsAddRowButton();
  },
);

When(
  "I select {string} from hs code items hs code on Input Page",
  async function (this: ICustomWorld, value: string) {
    await this.POManager.inputPage.selectHsCodeItemsHsCode(value);
  },
);

When(
  "I enter {string} in hs code quantity on Input Page",
  async function (this: ICustomWorld, hsCodeQuantity: string) {
    await this.POManager.inputPage.enterHsCodeQuantity(hsCodeQuantity);
  },
);

When(
  "I enter {string} in uom on Input Page",
  async function (this: ICustomWorld, uom: string) {
    await this.POManager.inputPage.enterUom(uom);
  },
);

When(
  "I select {string} from hs code unit price currency on Input Page",
  async function (this: ICustomWorld, hsCodeUnitPriceCurrency: string) {
    await this.POManager.inputPage.selectHsCodeUnitPriceCurrency(
      hsCodeUnitPriceCurrency,
    );
  },
);

When(
  "I enter {string} in hs code unit price on Input Page",
  async function (this: ICustomWorld, hsCodeUnitPrice: string) {
    await this.POManager.inputPage.enterHsCodeUnitPrice(hsCodeUnitPrice);
  },
);

When(
  "I select {string} from hs code marging currency on Input Page",
  async function (this: ICustomWorld, hsCodeMargingCurrency: string) {
    await this.POManager.inputPage.selectHsCodeMargingCurrency(
      hsCodeMargingCurrency,
    );
  },
);

When(
  "I enter {string} in hs code maring price on Input Page",
  async function (this: ICustomWorld, hsCodeMaringPrice: string) {
    await this.POManager.inputPage.enterHsCodeMaringPrice(hsCodeMaringPrice);
  },
);

When(
  "I select {string} from hs code country of origin on Input Page",
  async function (this: ICustomWorld, hsCodeCountryOfOrigin: string) {
    await this.POManager.inputPage.selectHsCodeCountryOfOrigin(
      hsCodeCountryOfOrigin,
    );
  },
);

When(
  "I enter {string} in hs code gd number on Input Page",
  async function (this: ICustomWorld, hsCodeGdNumber: string) {
    await this.POManager.inputPage.enterHsCodeGdNumber(hsCodeGdNumber);
  },
);

When("I check use on Input Page", async function (this: ICustomWorld) {
  await this.POManager.inputPage.checkUse();
});

When(
  "I click on hs code items save button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickHsCodeItemsSaveButton();
  },
);

When(
  "I click on gd items add row button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickGdItemsAddRowButton();
  },
);

When(
  "I enter {string} in gd no on Input Page",
  async function (this: ICustomWorld, gdNo: string) {
    await this.POManager.inputPage.enterGdNo(gdNo);
  },
);

When(
  "I select {string} from gd currency on Input Page",
  async function (this: ICustomWorld, gdCurrency: string) {
    await this.POManager.inputPage.selectGdCurrency(gdCurrency);
  },
);

When(
  "I enter {string} in gd amount on Input Page",
  async function (this: ICustomWorld, gdAmount: string) {
    await this.POManager.inputPage.enterGdAmount(gdAmount);
  },
);

When(
  "I enter {string} in gd date on Input Page",
  async function (this: ICustomWorld, date: string) {
    await this.POManager.inputPage.enterGdDate(date);
  },
);

When(
  "I enter {string} in gd realization date on Input Page",
  async function (this: ICustomWorld, date: string) {
    await this.POManager.inputPage.enterGdRealizationDate(date);
  },
);

When(
  "I enter {string} in realization on Input Page",
  async function (this: ICustomWorld, realization: string) {
    await this.POManager.inputPage.enterRealization(realization);
  },
);

When(
  "I select {string} from insurance currency on Input Page",
  async function (this: ICustomWorld, insuranceCurrency: string) {
    await this.POManager.inputPage.selectInsuranceCurrency(insuranceCurrency);
  },
);

When(
  "I enter {string} in insurance amount on Input Page",
  async function (this: ICustomWorld, insuranceAmount: string) {
    await this.POManager.inputPage.enterInsuranceAmount(insuranceAmount);
  },
);

When(
  "I select {string} from freight currency on Input Page",
  async function (this: ICustomWorld, freightCurrency: string) {
    await this.POManager.inputPage.selectFreightCurrency(freightCurrency);
  },
);

When(
  "I enter {string} in freight amount on Input Page",
  async function (this: ICustomWorld, freightAmount: string) {
    await this.POManager.inputPage.enterFreightAmount(freightAmount);
  },
);

When("I check used on Input Page", async function (this: ICustomWorld) {
  await this.POManager.inputPage.checkUsed();
});

When(
  "I click on gd items save button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickGdItemsSaveButton();
  },
);

When(
  "I enter {string} in comments on Input Page",
  async function (this: ICustomWorld, comments: string) {
    await this.POManager.inputPage.enterComments(comments);
  },
);

When(
  "I click on validate button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickValidate();
  },
);

When(
  "I click on financials button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickFinancials();
  },
);

When(
  "I click on close button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.clickClose();
  },
);

When(
  "I click on submit button on Input Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.submit();
  },
);

When(
  "I click on authorize button on Page",
  async function (this: ICustomWorld) {
    await this.POManager.inputPage.authorize();
  },
);

Then("I should see the full lc on page", async function (this: ICustomWorld) {
  // Close any toast first so it doesn't cover the LC in the screenshot
  const toastCloseButtons = this.page.locator(".p-toast-close-button");
  for (const closeButton of await toastCloseButtons.all()) {
    if (await closeButton.isVisible()) {
      // The toast may close on its own in the meantime, so a failed click is fine
      await closeButton.click({ timeout: 5000 }).catch(() => undefined);
    }
  }
  await expect(toastCloseButtons).toHaveCount(0);

  await expect(
    this.page.getByText(globalVariables.ILC_SIGHT_REF_NUMB),
  ).toBeVisible();
  await ScreenshotManager.captureFullScreenshot(this, "LC_Full_View");
});
