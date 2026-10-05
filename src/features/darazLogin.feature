@daraz
Feature: Daraz Pakistan login
  As a registered Daraz customer
  I want to log in using my phone number or email and password
  So that I can access my account

  Background:
    Given I open the Daraz website
    When I open the Daraz login form

  @daraz-ui
  Scenario: Display the Daraz password login form
    Then the Daraz login form should be displayed

  @daraz-login
  Scenario Outline: Log in to Daraz with valid credentials
    When I enter Daraz username "<username>"
    And I enter Daraz password "<password>"
    And I click the Daraz login button
    Then I should be logged in to Daraz

    Examples:
    | username           | password         |
    | env:TEST_USERNAME | env:TEST_PASSWORD |
    | env:TEST_USERNAME2 | env:TEST_PASSWORD2 |
    # | env:TEST_USERNAME | env:TEST_PASSWORD |
    # | env:TEST_USERNAME | env:TEST_PASSWORD |
