import GaragePage from './pages/garage/garagePage';
import Page from './pages/page';
import HeaderButtons from './headerBtns';

class App {
  private static container: HTMLElement = document.body;

  private header: HeaderButtons;

  constructor() {
    this.header = new HeaderButtons('header', 'header');
  }

  public static renderNewPage(id: string):void {
    const page: Page = new GaragePage(id);
    const pageHTML = page.render();
    this.container.append(pageHTML);
  }

  public run(): void {
    App.container.append(this.header.render());
    App.renderNewPage('garage');
  }
}

export default App;
