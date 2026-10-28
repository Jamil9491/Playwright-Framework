import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../Framework/support/world";
import { dbService, DbService } from "../Framework/utils/dbService";
import { GlobalKey, GlobalVariables } from "../Framework/utils/globalVariables";

interface EmployeeSkillRow {
  employee: string;
  department: string;
  skill_name: string;
  proficiency: string;
  years_experience: number;
}

const EMPLOYEE_SKILLS_QUERY = `
    SELECT e.first_name || ' ' || e.last_name AS employee,
           e.department,
           s.skill_name,
           s.proficiency,
           s.years_experience
    FROM employee e
    JOIN skills s ON s.employee_id = e.employee_id
    ORDER BY e.employee_id, s.skill_name`;

const LATEST_SALARY_QUERY = `
    SELECT salary
    FROM employee
    ORDER BY employee_id DESC
    LIMIT 1`;

When(
  "I fetch all employees with their skills from the database",
  async function (this: ICustomWorld) {
    this.testData.employeeSkills = await dbService.getRows<EmployeeSkillRow>(
      EMPLOYEE_SKILLS_QUERY,
    );
  },
);

Then(
  "the employee skills should be printed to the console",
  async function (this: ICustomWorld) {
    const rows: EmployeeSkillRow[] = this.testData.employeeSkills;

    if (rows.length === 0) {
      throw new Error("No employee skills returned from the database.");
    }

    this.logger.info(`Employee skills (${rows.length} rows):`);
    console.table(rows);

    // Also attach the result to the Allure report
    this.attach(DbService.formatRows(rows), "text/plain");
  },
);

When(
  "I fetch the salary of the latest employee from the database",
  async function (this: ICustomWorld) {
    await dbService.fetchAndStore(
      GlobalKey.ILC_SIGHT_REF_NUMB,
      LATEST_SALARY_QUERY,
    );
  },
);

Then(
  "the salary should be stored in global variable ILC_SIGHT_REF_NUMB",
  async function (this: ICustomWorld) {
    const salary = GlobalVariables.ILC_SIGHT_REF_NUMB;

    if (!salary) {
      throw new Error(
        "ILC_SIGHT_REF_NUMB is empty - no salary returned from the database.",
      );
    }

    this.logger.info(`ILC_SIGHT_REF_NUMB = ${salary}`);
  },
);
