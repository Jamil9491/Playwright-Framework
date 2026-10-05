import { Page } from "@playwright/test";
import {DarazHomePage} from "./darazHomePage";
import {DarazLoginPage} from "./darazLoginPage";
export class POManager {
  page: Page;
    private _darazHomePage?: DarazHomePage;
    private _darazLoginPage?: DarazLoginPage;
  constructor(page: Page) {
    this.page = page;
  }


  get darazHomePage(): DarazHomePage {
    return (this._darazHomePage ??= new DarazHomePage(this.page));
  }


  get DarazLoginPage(): DarazLoginPage {
    return (this._darazLoginPage ??= new DarazLoginPage(this.page));
  }
}

export default POManager;
