import { Page } from "@playwright/test";
import { LoginTFSPage } from "./loginTFSPage";
import { IlcSightPage } from "./ilcSightPage";
import { LogutTFSPage } from "./logutTFSPage";

export class POManager {
  page: Page;
  private _loginTFSPage?: LoginTFSPage;
  private _ilcSightPage?: IlcSightPage;
  private _logutTFSPage?: LogutTFSPage;

  constructor(page: Page) {
    this.page = page;
  }
  get LoginTFSPage(): LoginTFSPage {
    return (this._loginTFSPage ??= new LoginTFSPage(this.page));
  }

  get ilcSightPage(): IlcSightPage {
    return (this._ilcSightPage ??= new IlcSightPage(this.page));
  }
  get logutTFSPage(): LogutTFSPage {
    return (this._logutTFSPage ??= new LogutTFSPage(this.page));
  }
}

export default POManager;
