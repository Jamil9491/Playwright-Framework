@_192
Feature: Complete ilcSight

  @ilc-sight
  Scenario Outline: Complete ilcSight
    Given I open the Login Page
    When I enter "<username>" in username on Login Page
    And I enter "<password>" in password on Login Page
    And I click on sign in button on Login Page
    And I click on letter of credit button on Ilc Sight Page
    And I click on create link on Ilc Sight Page
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
    And I select "<currency>" from currency on Ilc Sight Page
    And I enter "<amount>" in amount on Ilc Sight Page
    And I select "<toleranceType>" from tolerance type on Ilc Sight Page
    And I enter "<percent>" in percent on Ilc Sight Page
    And I enter "<percent>" in percent on Ilc Sight Page (interaction 2)
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
    And I click on validate button on Ilc Sight Page
    And I click on continue button on Ilc Sight Page
    And I click on submit button on Ilc Sight Page

    Examples:
      | username | password | productType | applicantReference | applicationDate | transferMethod | expiryDate | confirmation | expiryPlace | beneficiaryBank | beneficiaryCountry | beneficiaryAccount | advisingBank | currency | amount | toleranceType | percent | availableBy | presentationPeriodDays | presentationPeriodDescription | documentSendMode | goodsDescription | marginForm | marginPercent | marginCurrency | marginAccount | initiatingBranch | processingBranch |
      | log | log | ILC Sight | cif-0000-0000 | 10/23/2026 | Mail / Courier | 10/31/2026 | May Add | this is expiry place | CIF000003 - National Bank Corporation | AMERICAN SAMOA | 213423452345 | CIF000004 - Global International Bank | Pakistani rupee | 1000 | Percentage | 5 | Mixed Payment | 6 | this is presentation period description | First Class Mail | this is goods description | Percentage | 6 | Pakistani rupee | AC-00000-00001 (CURRENT_ACC) | 787 - HBL PLAZA BR, Bahawalpur | 787 - HBL PLAZA BR, Bahawalpur |
