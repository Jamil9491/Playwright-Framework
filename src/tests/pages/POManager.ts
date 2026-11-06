import { Page } from "@playwright/test";
import { LoginTFSPage } from "./loginTFSPage";
import { IlcSightPage } from "./ilcSightPage";
import { LogutTFSPage } from "./logutTFSPage";
import { InputPage } from "./inputPage";

export class POManager {
  page: Page;
  private _loginTFSPage?: LoginTFSPage;
  private _ilcSightPage?: IlcSightPage;
  private _logutTFSPage?: LogutTFSPage;
  private _inputPage?: InputPage;

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
  get inputPage(): InputPage {
    return (this._inputPage ??= new InputPage(this.page));
  }
}

export default POManager;
