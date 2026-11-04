@logout-tfs
Feature: logout TFS Application

  Background:
    Given user profile menu is visible on page

  Scenario: User should be logout TFS Application
    When I click on profile button on Page
    And I click on sign out button on Page
    Then username field should be displayed on Page
