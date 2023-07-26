import Page from '../../templates/page';
import WinnersTable from './winnersTable';

class WinnersPage extends Page {
  private winnersTable = new WinnersTable('div', 'garage');

  public render():HTMLElement {
    this.renderWinnersTableContainer();
    return this.container;
  }

  public async renderWinnersTableContainer():Promise<HTMLElement> {
    const winnersTableContainer = await this.winnersTable.render();
    this.container.append(winnersTableContainer);
    return this.container;
  }
}

export default WinnersPage;
