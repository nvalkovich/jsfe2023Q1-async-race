import GaragePage from './pages/garage/garagePage';
import WinnersPage from './pages/winners/winnersPage';
import Page from './templates/page';
import { PageIds } from '../types/enums';
import HeaderButtons from './pages/garage/headerBtns';

class App {
  private static container: HTMLElement = document.body;

  private static defaultPageID = 'garage';

  private initialPage: GaragePage;

  private header: HeaderButtons;

  constructor() {
    this.initialPage = new GaragePage('garage');
    this.header = new HeaderButtons('header', 'header');
  }

  public static renderNewPage(id: string):void {
    const currentPageHTML = document.querySelector(`#${this.defaultPageID}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }
    let page: Page | null = null;
    if (id === PageIds.Garage) {
      page = new GaragePage(id);
    } else if (id === PageIds.Winners) {
      page = new WinnersPage(id);
    }
    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageID;

      this.container.append(pageHTML);
    }
  }

  public run(): void {
    this.route();
    App.container.append(this.header.render());
    const mainPageHtml = this.initialPage.render();
    App.container.append(mainPageHtml);
    window.location.hash = `#${App.defaultPageID}`;
  }

  private route():void {
    window.addEventListener('hashchange', (e) => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }
}

export default App;
