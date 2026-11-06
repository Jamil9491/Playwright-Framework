@ilcFeature
Feature: Complete ILC Sight
Background:
    Given user profile menu is visible on page

  @ilc-sight
  Scenario Outline: Complete ILC Sight Log Stage
    
    When I click on letter of credit button on Page
    And I click on create menu on Page
    And I select "<productType>" from product type on Ilc Sight Page
    And I enter "<applicantReference>" in applicant reference on Ilc Sight Page
    And I click on fetch button on Ilc Sight Page
    And I enter "<applicationDate>" in application date on Ilc Sight Page
    And I select "<transferMethod>" from transfer method on Ilc Sight Page
    And I enter "<expiryDate>" in expiry date on Ilc Sight Page
    And I select "<confirmation>" from confirmation on Ilc Sight Page
    And I check transferable on Ilc Sight Page
    And I check revolving on Ilc Sight Page
    And I enter "<expiryPlace>" in expiry place on Ilc Sight Page
    And I select "<beneficiaryBank>" from beneficiary bank on Ilc Sight Page
    And I select "<beneficiaryCountry>" from beneficiary country on Ilc Sight Page
    And I enter "<beneficiaryAccount>" in beneficiary account on Ilc Sight Page
    And I select "<advisingBank>" from advising bank on Ilc Sight Page
    And I enter "<amount>" in amount on Ilc Sight Page
    And I select "<currency>" from currency on Ilc Sight Page
    And I select "<toleranceType>" from tolerance type on Ilc Sight Page
    And I enter "<amount24>" in amount on Ilc Sight Page (interaction 2)
    And I enter "<amount25>" in amount on Ilc Sight Page (interaction 3)
    And I select "<availableBy>" from available by on Ilc Sight Page
    And I enter "<presentationPeriodDays>" in presentation period days on Ilc Sight Page
    And I enter "<presentationPeriodDescription>" in presentation period description on Ilc Sight Page
    And I select "<documentSendMode>" from document send mode on Ilc Sight Page
    And I enter "<goodsDescription>" in goods description on Ilc Sight Page
    And I select "<marginForm>" from margin form on Ilc Sight Page
    And I enter "<marginPercent>" in margin percent on Ilc Sight Page
    And I select "<marginCurrency>" from margin currency on Ilc Sight Page
    And I select "<marginAccount>" from margin account on Ilc Sight Page
    And I select "<initiatingBranch>" from initiating branch on Ilc Sight Page
    And I select "<processingBranch>" from processing branch on Ilc Sight Page
    And I click on add row button on Ilc Sight Page
    And I select "<type>" from type on Ilc Sight Page
    And I upload files "<fileName>" on attachments input on Ilc Sight Page
    And I click on save button on Ilc Sight Page
    And I click on validate button on Page
    And I click on submit button on Page
    Then User should navigate to "<endpoint>" screen
    Then Store the generated reference number in global variables

    Examples:
     | productType | applicantReference | applicationDate | transferMethod | expiryDate | confirmation | expiryPlace | beneficiaryBank | beneficiaryCountry | beneficiaryAccount | advisingBank | amount | currency | toleranceType | amount24 | amount25 | availableBy | presentationPeriodDays | presentationPeriodDescription | documentSendMode | goodsDescription | marginForm | marginPercent | marginCurrency | marginAccount | initiatingBranch | processingBranch | type | fileName | endpoint | Iteration |
      | ILC Sight | cif-0000-0000 | 10/15/2026 | Gateway | 10/30/2026 | May Add | expiry place | CIF000002 - XYZ Bank Limited | ALBANIA | 34523452345 | CIF000003 - National Bank Corporation | 1000 | Pakistani rupee | Amount | 166 | 166 | Deferred Payment | 8 | presentation description | Electronically | goods description | Percentage | 22 | Pakistani rupee | AC-00000-00002 (SAVING_ACC) | 787 - HBL PLAZA BR, Bahawalpur | 787 - HBL PLAZA BR, Bahawalpur | DT-000008 - Doc_Automation | image.png |/lc/find |DV_1      |
     | ILC Sight | cif-0000-0000 | 10/17/2026 | Mail / Courier | 10/30/2026 | May Add | expiry place DV2 | CIF000003 - National Bank Corporation | AFGHANISTAN | 213423452345 | CIF000004 - Global International Bank | 2000 | Pakistani rupee | Amount | 150 | 150 | Deferred Payment | 6 | presentation description DV2 | First Class Mail | goods description DV2 | Percentage | 10 | Pakistani rupee | AC-00000-00001 (CURRENT_ACC) | 787 - HBL PLAZA BR, Bahawalpur | 787 - HBL PLAZA BR, Bahawalpur | DT-000008 - Doc_Automation | image.png |/lc/find | DV_2      |




Scenario Outline: Complete ILC Sight Input Stage
    When I click on action queue button on Page
    And I click on unassigned queue link on Page
    And I click on pick button on Page
    And I click on my task link on Page
    And I open my LC on Page
    And I select "<applicableRules>" from applicable rules on Input Page
    And I click on phrases button on Input Page
    And I enter "<searchByName>" in search by name on Input Page
    And I click on searched phrase on Input Page
    And I enter "<principalCif>" in principal cif on Input Page
    And I click on fetch button on Input Page
    And I select "<adviseThroughBank>" from advise through bank on Input Page
    And I click on requested confirmation party button on Input Page
    And I select "<requestedConfirmationParty>" from requested confirmation party on Input Page
    And I select "<confirmationChargesPayableBy>" from confirmation charges payable by on Input Page
    And I click on phrases button on Input Page (interaction 2)
    And I enter "<searchByName18>" in search by name on Input Page
    And I click on automation phrase button on Input Page (interaction 2)
    And I enter "<instructionsToPayingAccepting>" in instructions to paying accepting on Input Page
    And I enter "<revolvePeriod>" in revolve period on Input Page
    And I select "<revolveFrequency>" from revolve frequency on Input Page
    And I enter "<noOfTimesToRevolve>" in no of times to revolve on Input Page
    And I enter "<nextRevolveDate>" in next revolve date on Input Page
    And I select "<revolvingType>" from revolving type on Input Page
    And I enter "<noticeDays>" in notice days on Input Page
    And I select "<availableWith>" from available with on Input Page
    And I enter "<city>" in city on Input Page
    And I click on country dropdown on Input Page
    And I enter "<overlay>" in overlay on Input Page
    And I select "<country>" from country on Input Page
    And I enter "<shipmentFrom>" in shipment from on Input Page
    And I enter "<shipmentTo>" in shipment to on Input Page
    And I enter "<placeOfLoading>" in place of loading on Input Page
    And I enter "<destinationPlace>" in destination place on Input Page
    And I select "<partialShipment>" from partial shipment on Input Page
    And I select "<transhipment>" from transhipment on Input Page
    And I enter "<shipmentDate>" in shipment date on Input Page
    And I enter "<shipmentPeriod>" in shipment period on Input Page
    And I enter "<namedPlace>" in named place on Input Page
    And I select "<incoterms>" from incoterms on Input Page
    And I select "<freight>" from freight on Input Page
    And I select "<modeOfShipment>" from mode of shipment on Input Page
    And I enter "<documents>" in documents on Input Page
    And I enter "<additionalConditions>" in additional conditions on Input Page
    And I enter "<specialPaymentConditionsForBeneficiary>" in special payment conditions for beneficiary on Input Page
    And I enter "<specialPaymentConditionsForBankOnly>" in special payment conditions for bank only on Input Page
    And I enter "<charge>" in charge on Input Page
    And I select "<ourCharges>" from our charges on Input Page
    And I select "<overseasCharges>" from overseas charges on Input Page
    And I select "<taxToBePaidBy>" from tax to be paid by on Input Page
    And I select "<chargeCurrency>" from charge currency on Input Page
    And I check defer beneficiary charges on Input Page
    And I check defer applicant charges on Input Page
    And I click on collateral Items add row button on Input Page
    And I select "<collateralCode>" from collateral code on Input Page
    And I enter "<description>" in description on Input Page
    And I enter "<collateralAmount>" in collateral amount on Input Page
    And I click on collateral Items save button on Input Page
    And I select "<fxDeal>" from fx deal on Input Page
    And I select "<reimbursingBank>" from reimbursing bank on Input Page
    # And I click on account select account button on Input Page
    And I select "<account>" from account on Input Page
    And I enter "<instructionsToReimbursingBank>" in instructions to reimbursing bank on Input Page
    And I select "<chargesBorneBy>" from charges borne by on Input Page
    And I select "<reimbursingBankApplicableRules>" from reimbursing bank applicable rules on Input Page
    And I click on Additional Party Items add row button on Input Page
    And I select "<additionalParties>" from additional parties on Input Page
    And I select "<correspondingAdditionalParty>" from corresponding additional party on Input Page
    And I click on additional party items save button on Input Page
    And I click on Additional Party Items add row button on Input Page
    And I select "<additionalParties72>" from additional parties on Input Page (interaction 2)
    And I select "<correspondingAdditionalParty73>" from corresponding additional party on Input Page (interaction 2)
    And I click on additional party items save button on Input Page (interaction 2)
    And I click on hs code items add row button on Input Page
    And I select "<hsCodeItemsHsCode>" from hs code items hs code on Input Page
    And I enter "<hsCodeQuantity>" in hs code quantity on Input Page
    And I enter "<uom>" in uom on Input Page
    And I select "<hsCodeUnitPriceCurrency>" from hs code unit price currency on Input Page
    And I enter "<hsCodeUnitPrice>" in hs code unit price on Input Page
    And I select "<hsCodeMargingCurrency>" from hs code marging currency on Input Page
    And I enter "<hsCodeMaringPrice>" in hs code maring price on Input Page
    And I select "<hsCodeCountryOfOrigin>" from hs code country of origin on Input Page
    And I enter "<hsCodeGdNumber>" in hs code gd number on Input Page
    And I check use on Input Page
    And I click on hs code items save button on Input Page
    And I click on gd items add row button on Input Page
    And I enter "<gdNo>" in gd no on Input Page
    And I select "<gdCurrency>" from gd currency on Input Page
    And I enter "<gdAmount>" in gd amount on Input Page
    And I enter "<date>" in gd date on Input Page
    And I enter "<date94>" in gd realization date on Input Page
    And I enter "<realization>" in realization on Input Page
    And I select "<insuranceCurrency>" from insurance currency on Input Page
    And I enter "<insuranceAmount>" in insurance amount on Input Page
    And I select "<freightCurrency>" from freight currency on Input Page
    And I enter "<freightAmount>" in freight amount on Input Page
    And I check used on Input Page
    And I click on gd items save button on Input Page
    And I enter "<comments>" in comments on Input Page
    And I click on validate button on Input Page
    # And I click on financials button on Input Page
    # And I click on close button on Input Page
    And I click on submit button on Input Page
    Then User should navigate to "<endpoint>" screen
    Examples:
      | applicableRules | searchByName | principalCif | adviseThroughBank | requestedConfirmationParty | confirmationChargesPayableBy | searchByName18 | instructionsToPayingAccepting | revolvePeriod | revolveFrequency | noOfTimesToRevolve | nextRevolveDate | revolvingType | noticeDays | availableWith | city | overlay | country | shipmentFrom | shipmentTo | placeOfLoading | destinationPlace | partialShipment | transhipment | shipmentDate | shipmentPeriod | namedPlace | incoterms | freight | modeOfShipment | documents | additionalConditions | specialPaymentConditionsForBeneficiary | specialPaymentConditionsForBankOnly | charge | ourCharges | overseasCharges | taxToBePaidBy | chargeCurrency | collateralCode | description | collateralAmount | fxDeal | reimbursingBank | account | instructionsToReimbursingBank | chargesBorneBy | reimbursingBankApplicableRules | additionalParties | correspondingAdditionalParty | additionalParties72 | correspondingAdditionalParty73 | hsCodeItemsHsCode | hsCodeQuantity | uom | hsCodeUnitPriceCurrency | hsCodeUnitPrice | hsCodeMargingCurrency | hsCodeMaringPrice | hsCodeCountryOfOrigin | hsCodeGdNumber | gdNo | gdCurrency | gdAmount | date | date94 | realization | insuranceCurrency | insuranceAmount | freightCurrency | freightAmount | comments |endpoint | Iteration |
      | EUCPURR - Latest Version | Automation | cif-0000-0001 | CIF000003 - National Bank Corporation | Advising Bank | Applicant | automation | This is instruction | 3 | Days | 4 | 11/30/2026 | Cumulative | 7 | Advising Bank | Lahore | Pakistan | PAKISTAN | shipment from location | shipment to location | port of landing | destination place | Allowed | Allowed | 11/26/2026 | shipment period | Named place | CIF | Freight Collect | Air | invoice documents | additional conditions | Special Payment Conditions for Beneficiary\n\n | Special Payment Conditions for Bank Only\n\n | Charge Head Text | Applicant | Applicant | Payer of Charge | Pakistani rupee | Cash Collateral | collateral description | 1000 | System | CIF000003 - National Bank Corporation | CIF000003 - National Bank Corporation | Instructions to Reimbursing Bank\n | Claimant | URR Latest Version | ADVISING BANK | CIF000003 - National Bank Corporation | BENEFICIARY | CIF000005 - Emirates Commercial Bank | 01012900 | 2 | 3 | Pakistani rupee | 4 | Pakistani rupee | 2 | AFGHANISTAN | 1234 | 4523452345 | Pakistani rupee | 6000 | 11/25/2026 | 11/17/2026 | test fund realization | Pakistani rupee | 1000 | US Dollar | 1800 | approved from input side |/ac-que/my | DV_1      |


Scenario Outline: Complete ILC Sight Review Stage
    When I click on action queue button on Page
    And I click on unassigned queue link on Page
    And I click on pick button on Page
    And I click on my task link on Page
    And I open my LC on Page
    And I enter "<comments>" in comments on Input Page
    And I click on submit button on Input Page
    Then User should navigate to "<endpoint>" screen

    Examples:
      | comments |endpoint | Iteration |
      | approved from review side |/ac-que/my | DV_1      |


Scenario Outline: Complete ILC Sight Authorize Stage
    When I click on action queue button on Page
    And I click on unassigned queue link on Page
    And I click on pick button on Page
    And I click on my task link on Page
    And I open my LC on Page
    And I enter "<comments>" in comments on Input Page
    And I click on authorize button on Page
    Then User should navigate to "<endpoint>" screen
    When I click on letter of credit button on Page
    And I click on find menu on Page
    And I open my LC on Page
    Then I should see the full lc on page
    Examples:
      | comments |endpoint | Iteration |
      | authorize from authorizer side |/ac-que/my | DV_1      |