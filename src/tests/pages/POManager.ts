import { Page } from "@playwright/test";
import { LoginPage } from "./loginPage";
import { IlcSightPage } from "./ilcSightPage";
export class POManager {
  page: Page;
  private _loginPage?: LoginPage;
  private _ilcSightPage?: IlcSightPage;

  constructor(page: Page) {
    this.page = page;
  }
  get LoginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this.page));
  }

  get ilcSightPage(): IlcSightPage {
    return (this._ilcSightPage ??= new IlcSightPage(this.page));
  }
}

export default POManager;
