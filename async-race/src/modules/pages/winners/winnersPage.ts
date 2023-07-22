import Page from '../page';
import createBlock from '../../helpers';

class WinnersPage extends Page {
  public render():HTMLElement {
    const winnersTitle = createBlock({
      tag: 'h2',
      className: 'winners-title',
      innerHTML: 'Winners ()',
      parentBlock: this.container,
    });

    this.renderWinnersTable();
    return this.container;
  }

  public renderWinnersTable():HTMLElement {
    const winnersTableContainer = createBlock({
      tag: 'div',
      className: 'winners-table-container',
      parentBlock: this.container,
    });
    const page = createBlock({
      tag: 'h3',
      className: 'winners-table-container__page',
      innerHTML: 'Page #',
      parentBlock: winnersTableContainer,
    });
    const winnersTable = createBlock({
      tag: 'div',
      className: 'winners-table-container__table winners-table',
      parentBlock: winnersTableContainer,
    });

    this.renderWinnersTableHead(winnersTable);
    this.renderWinnersTableData(winnersTable);
    return this.container;
  }

  private winnersTableCategories = [
    'Number', 'Car', 'Name', 'Wins', 'Best time(seconds)',
  ];

  public renderWinnersTableHead(table: HTMLElement):void {
    const winnersTableHeadRow = createBlock({
      tag: 'tr',
      className: 'winners-table__head-row winners-table-head-row',
      parentBlock: table,
    });

    this.winnersTableCategories.forEach((category) => {
      const winnersTableHeadData = createBlock({
        tag: 'th',
        className: 'winners-table-head-row__data',
        innerHTML: category,
        parentBlock: winnersTableHeadRow,
      });
    });
  }

  private renderCarImage(parent: HTMLElement): HTMLElement {
    const carImage = createBlock({
      tag: 'div',
      className: 'car-drive__image',
      innerHTML: `<svg width="50px" height="50px" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" fill="none" width="50" height="50"/>
      <g>
      <circle cx="14" cy="13.5" r="1.5"/>
      <path d="M16.1 9h-1.6c-.6-2.7-3.2-4.5-5.9-3.9C6.6 5.5 5 7 4.6 9h-.7c-1 0-1.9.9-1.9 1.9v1.3c0 .7.6 1.3 1.3 1.3h.3c0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4h3.2c0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4h.3c.7 0 1.3-.6 1.3-1.3V11c0-1.1-.9-2-1.9-2zM6.2 9c.5-1.9 2.5-2.9 4.3-2.4 1.1.3 2 1.2 2.4 2.4H6.2zM6 12c-.8 0-1.5.7-1.5 1.5S5.2 15 6 15s1.5-.7 1.5-1.5S6.8 12 6 12z"/>
      </g>
      </svg>`,
      parentBlock: parent,
    });

    carImage.style.fill = 'red';

    return carImage;
  }

  public renderWinnersTableData(table: HTMLElement):void {
    const winnersTableDataRow = createBlock({
      tag: 'tr',
      className: 'winners-table__row winners-table-row',
      parentBlock: table,
    });
  }
}

export default WinnersPage;
