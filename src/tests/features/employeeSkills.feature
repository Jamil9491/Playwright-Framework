@db
Feature: Employee skills database report
  As a QA engineer
  I want to query employee skills from the HR database
  So that I can verify the data is available

  @db-employee-skills
  Scenario: Fetch employees with their skills
    When I fetch all employees with their skills from the database
    Then the employee skills should be printed to the console

  @db-latest-salary
  Scenario: Store the latest employee's salary in a global variable
    When I fetch the salary of the latest employee from the database
    Then the salary should be stored in global variable ILC_SIGHT_REF_NUMB
