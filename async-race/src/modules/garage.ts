import Component from './component';
import { CarData } from '../types/interfaces';
import { createBlock, findElement } from './helpers';
import Api from './api';

class Garage extends Component {
  public static carsNumber: number;

  private api: Api;

  public static carsData: [CarData] | [];

  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    super(tag, className);
    this.api = new Api();
  }

  public async render():Promise<HTMLElement> {
    Garage.carsData = await this.api.getCars();
    this.setCarsNumber();

    const garageTitle = createBlock({
      tag: 'h2',
      className: 'garage-title',
      parentBlock: this.container,
    });

    const carsContainer = createBlock({
      tag: 'div',
      className: 'cars-container',
      parentBlock: this.container,
    });

    this.renderCars(carsContainer, Garage.carsData);

    garageTitle.innerHTML = `Garage (${Garage.carsNumber})`;

    console.log(this.container);
    return this.container;
  }

  public async updateCarsData():Promise <void> {
    const carsData = await this.api.getCars();
    Garage.carsData = carsData;
    console.log(Garage.carsData);
  }

  public setCarsNumber(): void {
    Garage.carsNumber = Garage.carsData.length;
  }

  public renderCarsNumber(): void {
    const garageTitle = findElement('.garage-title');
    garageTitle.innerHTML = `Garage (${Garage.carsNumber})`;
  }

  public renderCars(container: HTMLElement, data:[CarData]):HTMLElement {
    data.forEach((car) => {
      container.append(this.renderCar(car));
    });
    return container;
  }

  public renderCar(data: CarData): HTMLElement {
    console.log('before', Garage.carsData);

    const carContainer = createBlock({
      tag: 'div',
      className: 'car',
    });
    const carContainerHeader = createBlock({
      tag: 'div',
      className: 'car__header car-header',
      parentBlock: carContainer,
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
      parentBlock: carContainer,
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

    return carContainer;
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

    return carHeaderBtns;
  }

  private renderCarDriveBtns(): HTMLElement {
    const carDriveBtns = createBlock({
      tag: 'div',
      className: 'car-drive__btns',
    });
    const carStartBtn = createBlock({
      tag: 'div',
      className: 'car-drive__btn btn btn_start',
      innerHTML: 'A',
      parentBlock: carDriveBtns,
    });
    const carStopBtn = createBlock({
      tag: 'div',
      className: 'car-drive__btn btn btn_stop',
      innerHTML: 'B',
      parentBlock: carDriveBtns,
    });

    return carDriveBtns;
  }
}

export default Garage;
