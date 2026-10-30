@_192
Feature: Login TFS Application

  @login-tfs
  Scenario Outline: User Should be Login TFS Application
    Given Application Login Screen is Opened
    When User Enter Values in respective fields as
      | UserName | Password       | Iteration |
      | <Username> | <Password>    | <Iteration> |
    And User Clicks Sign In Button
    Then user profile menu is visible on page

    Examples:
      | Username    | Password  | Iteration |
      | log         | log       | DV_1      |
      | input       | input     | DV_2      |