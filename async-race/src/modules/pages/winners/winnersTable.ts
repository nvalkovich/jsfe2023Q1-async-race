import Component from '../../templates/component';
import { WinnerData } from '../../../types/interfaces';
import { createBlock, createCarSVG, findElement } from '../../helpers/helpers';
import Api from '../../api/api';
import {
  getLocalStorage, setLocalStorage,
} from '../../../state/localstorage';

class WinnersTable extends Component {
  public static winnersNumber: number;

  private api: Api;

  public static winnersData: WinnerData[] | [];

  public static pageNum: number;

  public static limit: number;

  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    super(tag, className);
    this.api = new Api();
    WinnersTable.pageNum = Number(getLocalStorage('currentWinnerPage'));
    WinnersTable.limit = Api.winnersLimit;
  }

  public async render(): Promise<HTMLElement> {
    this.container.innerHTML = '';
    const winners = await this.api.getWinners();
    WinnersTable.winnersNumber = winners.length;
    if (!WinnersTable.pageNum
      || WinnersTable.pageNum > Math.ceil(WinnersTable.winnersNumber / Api.winnersLimit)) {
      WinnersTable.pageNum = 1;
    }
    WinnersTable.winnersData = await
    this.api.getWinners(WinnersTable.pageNum);

    const winnersTitle = createBlock({
      tag: 'h2',
      className: 'winners-title',
      innerHTML: `Winners (${WinnersTable.winnersNumber})`,
      parentBlock: this.container,
    });

    const winnersTableContainer = createBlock({
      tag: 'div',
      className: 'winners-table-container',
      parentBlock: this.container,
    });

    this.renderWinnersTable(winnersTableContainer);

    return this.container;
  }

  public async renderWinnersTable(container: HTMLElement):Promise<HTMLElement> {
    const sortCategory = getLocalStorage('currentSortCategory');
    const sortOrder = getLocalStorage('currentSortOrder');
    if (sortCategory && sortOrder) {
      WinnersTable.winnersData = await this.api.getWinners(
        WinnersTable.pageNum,
        sortCategory,
        sortOrder,
      );
    }

    const page = createBlock({
      tag: 'h3',
      className: 'winners-table-container__page',
      innerHTML: `Page #${WinnersTable.pageNum}`,
      parentBlock: container,
    });
    const winnersTable = createBlock({
      tag: 'div',
      className: 'winners-table-container__table winners-table',
      parentBlock: container,
    });

    this.renderWinnersTableHead(winnersTable);
    this.renderWinnersTableData(winnersTable);

    const winnersPageBtnsContainer = createBlock({
      tag: 'div',
      className: 'winner-page-buttons',
      parentBlock: container,
    });

    const winnersPageBtnPrev = createBlock({
      tag: 'button',
      className: 'winner-page-buttons__btn btn winners-btn winners-btn_prev',
      innerHTML: '<<',
      parentBlock: winnersPageBtnsContainer,
    });

    const winnersPageBtnNext = createBlock({
      tag: 'button',
      className: 'winner-page-buttons__btn btn winners-btn winners-btn_next',
      innerHTML: '>>',
      parentBlock: winnersPageBtnsContainer,
    });

    winnersPageBtnNext.addEventListener('click', () => {
      this.moveToNextWinnersPage();
    });

    winnersPageBtnPrev.addEventListener('click', () => {
      this.moveToPrevWinnersPage();
    });

    if (WinnersTable.pageNum === Math.ceil(WinnersTable.winnersNumber / WinnersTable.limit)) {
      winnersPageBtnNext.disabled = true;
    }

    if (WinnersTable.pageNum === 1) {
      winnersPageBtnPrev.disabled = true;
    }

    const sortContainer = createBlock({
      tag: 'div',
      className: 'winners-table-container__sort-container sort-container',
      parentBlock: container,
    });

    const sortByWins = this.renderSortBtns('wins');
    const sortByTime = this.renderSortBtns('time');
    sortContainer.append(sortByWins);
    sortContainer.append(sortByTime);

    return this.container;
  }

  public moveToNextWinnersPage(): void {
    this.container.innerHTML = '';
    WinnersTable.pageNum += 1;
    setLocalStorage('currentWinnerPage', WinnersTable.pageNum.toString());
    this.render();
  }

  public moveToPrevWinnersPage(): void {
    this.container.innerHTML = '';
    WinnersTable.pageNum -= 1;
    setLocalStorage('currentWinnerPage', WinnersTable.pageNum.toString());
    this.render();
  }

  private renderSortBtns(category: string): HTMLElement {
    const sortBtnsContainer = createBlock({
      tag: 'div',
      className: `winners-table-container__sort-container sort-btns-container sort-btns-container_${category}`,
    });
    const sortContainerText = createBlock({
      tag: 'div',
      className: 'sort-btns-container__text',
      innerHTML: `Sort by ${category}: `,
      parentBlock: sortBtnsContainer,
    });
    const btnSortASC = createBlock({
      tag: 'button',
      className: 'sort-btns-container__btn btn',
      innerHTML: 'ASC',
      parentBlock: sortContainerText,
    });
    const btnSortDESC = createBlock({
      tag: 'button',
      className: 'sort-btns-container__btn btn',
      innerHTML: 'DESC',
      parentBlock: sortContainerText,
    });

    btnSortASC.addEventListener('click', this.btnSortHandler.bind(this));
    btnSortDESC.addEventListener('click', this.btnSortHandler.bind(this));

    return sortBtnsContainer;
  }

  public async btnSortHandler(e: Event):Promise<void> {
    const { target } = e;
    if (target && target instanceof HTMLElement) {
      let category = 'id';
      if (target.closest('.sort-btns-container')?.classList.contains('sort-btns-container_time')) {
        category = 'time';
      } else {
        category = 'wins';
      }
      const order = target.innerHTML;
      WinnersTable.winnersData = await this.api.getWinners(WinnersTable.pageNum, category, order);
      setLocalStorage('currentSortOrder', order);
      setLocalStorage('currentSortCategory', category);
      const winnersTableContainer: HTMLElement = findElement('.winners-table-container');
      winnersTableContainer.innerHTML = '';
      this.renderWinnersTable(winnersTableContainer);
    }
  }

  private winnersTableCategories = [
    'Number', 'Car', 'Name', 'Wins', 'Best time',
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

  public async renderWinnersTableData(table: HTMLElement):Promise<void> {
    const data = WinnersTable.winnersData;

    data.forEach(async (winner, index) => {
      const winnersTableDataRow = createBlock({
        tag: 'tr',
        className: 'winners-table__row winners-table-row',
        parentBlock: table,
      });

      const prevNumbers = (WinnersTable.pageNum - 1) * WinnersTable.limit;
      const number = (index + 1) + prevNumbers;

      const winnersTableDataNum = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_num',
        innerHTML: `${number}`,
        parentBlock: winnersTableDataRow,
      });

      const winnersTableDataImage = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_image',
        innerHTML: createCarSVG(35, 35, '0 0 20 20'),
        parentBlock: winnersTableDataRow,
      });

      const carData = await this.api.getCar(winner.id);

      const { color } = carData;

      winnersTableDataImage.style.fill = color;

      const winnersTableDataName = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_name',
        innerHTML: `${carData.name}`,
        parentBlock: winnersTableDataRow,
      });

      const winnersTableDataWins = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_wins',
        innerHTML: `${winner.wins}`,
        parentBlock: winnersTableDataRow,
      });

      const winnersTableDataTime = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_time',
        innerHTML: `${winner.time}`,
        parentBlock: winnersTableDataRow,
      });
    });
  }
}

export default WinnersTable;
