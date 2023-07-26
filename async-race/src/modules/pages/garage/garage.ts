import Component from '../../templates/component';
import { CarData } from '../../../types/interfaces';
import { createBlock, findElement } from '../../helpers/helpers';
import Api from '../../api/api';
import { EngineStatus } from '../../../types/enums';
import Race from './race';

class Garage extends Component {
  public static carsNumber: number;

  public static selectedCarID: number;

  private api: Api;

  public static carsData: [CarData] | [];

  public static pageNum: number;

  public static limit: number;

  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    super(tag, className);
    this.api = new Api();
    Garage.pageNum = 1;
    Garage.limit = 7;
  }

  public async render(): Promise<HTMLElement> {
    this.container.innerHTML = '';

    this.setCarsNumber();

    Garage.carsData = await this.api.getCarsFromPage(Garage.pageNum);

    const garageTitle = createBlock({
      tag: 'h2',
      className: 'garage-title',
      parentBlock: this.container,
    });

    const page = createBlock({
      tag: 'h3',
      className: 'garage-page',
      innerHTML: `Page ${Garage.pageNum}`,
      parentBlock: this.container,
    });

    const carsContainer = createBlock({
      tag: 'div',
      className: 'cars-container',
      parentBlock: this.container,
    });

    await this.renderCars(carsContainer);

    garageTitle.innerHTML = `Garage (${Garage.carsNumber})`;

    const pageBtnsContainer = createBlock({
      tag: 'div',
      className: 'page-buttons',
      parentBlock: this.container,
    });

    const pageBtnPrev = createBlock({
      tag: 'button',
      className: 'page-buttons__btn  btn btn_prev',
      innerHTML: '<<',
      parentBlock: pageBtnsContainer,
    });

    const pageBtnNext = createBlock({
      tag: 'button',
      className: 'page-buttons__btn btn btn_next',
      innerHTML: '>>',
      parentBlock: pageBtnsContainer,
    });

    pageBtnNext.addEventListener('click', () => {
      this.moveToNextPage();
    });

    pageBtnPrev.addEventListener('click', () => {
      this.moveToPrevPage();
    });

    if (Garage.pageNum === Math.ceil(Garage.carsNumber / Garage.limit)) {
      pageBtnNext.disabled = true;
    }

    if (Garage.pageNum === 1) {
      pageBtnPrev.disabled = true;
    }

    return this.container;
  }

  public moveToNextPage(): void {
    this.container.innerHTML = '';
    Garage.pageNum += 1;
    this.render();
  }

  public moveToPrevPage(): void {
    this.container.innerHTML = '';
    Garage.pageNum -= 1;
    this.render();
  }

  public async updateCarsData(): Promise<void> {
    const carsData = await this.api.getCars();
    Garage.carsData = carsData;
  }

  public async setCarsNumber(): Promise<void> {
    const data = await this.api.getCars();
    Garage.carsNumber = data.length;
  }

  public renderCarsNumber(): void {
    const garageTitle = findElement('.garage-title');
    garageTitle.innerHTML = `Garage (${Garage.carsNumber})`;
  }

  public async rerenderCarsNumber(): Promise<void> {
    await this.updateCarsData();
    await this.setCarsNumber();
    this.renderCarsNumber();
  }

  public async renderCars(container: HTMLElement): Promise<HTMLElement> {
    const data: [CarData] | CarData[] = await this.api.getCarsFromPage(Garage.pageNum);
    data.forEach((car) => {
      const carContainer = createBlock({
        tag: 'div',
        className: 'car',
        parentBlock: container,
      });
      this.renderCar(car, carContainer);
    });
    return container;
  }

  public renderCar(data: CarData, container: HTMLElement): HTMLElement {
    const carContainerHeader = createBlock({
      tag: 'div',
      className: 'car__header car-header',
      parentBlock: container,
    });

    const carHeaderBtns = this.renderCarHeaderBtns();
    carContainerHeader.append(carHeaderBtns);

    const carName = createBlock({
      tag: 'p',
      className: 'car-header__name',
      innerHTML: data.name,
      parentBlock: carContainerHeader,
    });

    const carDriveContainer = createBlock({
      tag: 'div',
      className: 'car__drive car-drive',
      parentBlock: container,
    });

    const carDriveBtns = this.renderCarDriveBtns();
    carDriveContainer.append(carDriveBtns);

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
      parentBlock: carDriveContainer,
    });

    carImage.style.fill = data.color;

    const flag = createBlock({
      tag: 'div',
      className: 'car-drive__flag',
      parentBlock: carDriveContainer,
    });

    const parent = carContainerHeader.closest('.car');

    if (parent) {
      parent.id = `${data.id}`;
    }

    return container;
  }

  private renderCarHeaderBtns(): HTMLElement {
    const carHeaderBtns = createBlock({
      tag: 'div',
      className: 'car-header__btns',
    });
    const carSelectBtn = createBlock({
      tag: 'div',
      className: 'car-header__btn btn btn_select',
      innerHTML: 'select',
      parentBlock: carHeaderBtns,
    });
    const carRemoveBtn = createBlock({
      tag: 'div',
      className: 'car-header__btn btn btn_remove',
      innerHTML: 'remove',
      parentBlock: carHeaderBtns,
    });

    carRemoveBtn.addEventListener('click', this.btnRemoveHandler.bind(this));
    carSelectBtn.addEventListener('click', this.btnSelectHandler.bind(this));

    return carHeaderBtns;
  }

  private async btnSelectHandler(e: Event): Promise<void> {
    const { target } = e;
    if (target && target instanceof HTMLElement) {
      const id = Number(target.closest('.car')?.id);

      const inputNameUpdate: HTMLInputElement = findElement('.input-text_update');
      const inputColorPicker: HTMLInputElement = findElement('.input-color-picker_update');
      const inputBtn: HTMLButtonElement = findElement('.btn_update');
      inputNameUpdate.disabled = false;
      inputColorPicker.disabled = false;
      inputBtn.disabled = false;

      const carData = await this.api.getCar(id);
      inputNameUpdate.value = carData.name;
      inputColorPicker.value = carData.color;

      Garage.selectedCarID = id;
    }
  }

  private async btnRemoveHandler(e: Event): Promise<void> {
    const { target } = e;
    if (target && target instanceof HTMLElement) {
      const carsContainer: HTMLDivElement = findElement('.cars-container');
      const id = Number(target.closest('.car')?.id);
      const carElement: HTMLDivElement = findElement(`[id='${id}']`);
      carsContainer.removeChild(carElement);
      this.api.removeCar(id);
      this.api.removeWinner(id);
      await this.rerenderCarsNumber();
      Garage.carsData = await this.api.getCarsFromPage(Garage.pageNum);
      if (!Garage.carsData.length) {
        Garage.pageNum -= 1;
      }
      this.render();
    }
  }

  private renderCarDriveBtns(): HTMLElement {
    const carDriveBtns = createBlock({
      tag: 'div',
      className: 'car-drive__btns',
    });
    const carStartBtn = createBlock({
      tag: 'button',
      className: 'car-drive__btn btn btn_start',
      innerHTML: 'A',
      parentBlock: carDriveBtns,
    });
    const carStopBtn = createBlock({
      tag: 'button',
      className: 'car-drive__btn btn btn_stop',
      innerHTML: 'B',
      parentBlock: carDriveBtns,
    });

    carStopBtn.disabled = true;

    carStartBtn.addEventListener('click', this.carStartBtnHandler.bind(this));
    carStopBtn.addEventListener('click', this.carStopBtnHandler.bind(this));

    return carDriveBtns;
  }

  private async carStartBtnHandler(e: Event): Promise<void> {
    const { target } = e;
    if (target && target instanceof HTMLElement) {
      const id = Number(target.closest('.car')?.id);
      this.race(id, EngineStatus.Start);
    }
  }

  public async race(id: number, status: EngineStatus): Promise<void> {
    const race = new Race();
    if (status === EngineStatus.Start) {
      const duration = await this.api.setEngineStatus(id, EngineStatus.Start);
      race.startRace(id, EngineStatus.Start, duration);
    } else if (status === EngineStatus.Stop) {
      await this.api.setEngineStatus(id, EngineStatus.Stop);
      race.startRace(id, EngineStatus.Stop);
    }
  }

  private async carStopBtnHandler(e: Event): Promise<void> {
    const { target } = e;
    if (target && target instanceof HTMLElement) {
      const id = Number(target.closest('.car')?.id);
      this.race(id, EngineStatus.Stop);
    }
  }
}

export default Garage;
