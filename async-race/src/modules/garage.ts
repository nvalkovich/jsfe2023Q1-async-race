import Component from './component';
import GetCarsResponse from '../types/interfaces';
import createBlock from './helpers';

class Garage extends Component {
  private baseURL:string;

  private carsNumber: number;

  private path:{ [key: string]: string };

  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    super(tag, className);
    this.baseURL = 'http://127.0.0.1:3000';
    this.path = {
      garage: '/garage',
    };
    this.carsNumber = 0;
  }

  public async render():Promise<HTMLElement> {
    const carsData = await this.getCars();
    this.carsNumber = carsData.length;

    const garageTitle = createBlock({
      tag: 'h2',
      className: 'garage-title',
      innerHTML: `Garage (${this.carsNumber}) `,
      parentBlock: this.container,
    });

    const carsContainer = createBlock({
      tag: 'div',
      className: 'cars-container',
      parentBlock: this.container,
    });

    this.renderCars(carsContainer, carsData);

    console.log(this.container);
    return this.container;
  }

  public async renderCars(container: HTMLElement, data:[GetCarsResponse]):Promise<HTMLElement> {
    data.forEach((car) => {
      const carContainer = createBlock({
        tag: 'div',
        className: 'car',
        parentBlock: container,
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
        innerHTML: car.name,
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

      carImage.style.fill = car.color;

      const flag = createBlock({
        tag: 'div',
        className: 'car-drive__flag',
        parentBlock: carDriveContainer,
      });
    });
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

  public async getCarsTotalCount():Promise<[GetCarsResponse]> {
    const response: Response = await fetch(`${this.baseURL}${this.path.garage}`);
    const data = await response.json();
    return data;
  }

  public async getCars():Promise<[GetCarsResponse]> {
    const path = {
      garage: '/garage',
    };

    const queryString = (queryParams: { key : string, value: string }[]): string => {
      let string = '';
      if (queryParams.length) {
        string = `?${
          queryParams.map((x):string => `${x.key}=${x.value}`).join('&')}`;
      }
      console.log('str', string);
      return string;
    };

    const query = queryString([{ key: 'page', value: '1' }, { key: 'limit', value: '1' }]);
    const response: Response = await fetch(`${this.baseURL}${path.garage}${query}`);
    const data = response.json();
    return data;
  }
}

export default Garage;
