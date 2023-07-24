import Component from './component';
import { createBlock, findElement, generateCars } from './helpers';
import { InputCategories } from '../types/enums';
import Garage from './garage';
import Api from './api';
import CarData from '../types/interfaces';

const inputFieldsCategories = Object.values(InputCategories);

class Settings extends Component {
  private api: Api;

  private garage: Garage;

  constructor() {
    super('div', 'settings');
    this.api = new Api();
    this.garage = new Garage('div', 'cars');
  }

  public render():HTMLElement {
    this.renderInputFields();
    this.renderCarControlBtns();
    return this.container;
  }

  private renderInputFields():void {
    const inputFieldsContainer = createBlock({
      tag: 'div',
      className: 'input-fields-container',
    });

    inputFieldsCategories.forEach((category) => {
      const inputField = createBlock({
        tag: 'div',
        className: `input-field input-field_${category}`,
        parentBlock: inputFieldsContainer,
      });
      const inputText = createBlock({
        tag: 'input',
        className: `input input-text input-text_${category}`,
        parentBlock: inputField,
      });
      inputText.type = 'text';
      const inputColorPicker = createBlock({
        tag: 'input',
        className: `input input-color-picker input-color-picker_${category}`,
        parentBlock: inputField,
      });
      inputColorPicker.type = 'color';
      const inputBtn = createBlock({
        tag: 'button',
        className: `input-container__btn btn btn_${category}`,
        innerHTML: `${category}`,
        parentBlock: inputField,
      });

      if (category === InputCategories.Update) {
        inputText.disabled = true;
        inputColorPicker.disabled = true;
        inputBtn.disabled = true;
      }

      inputBtn.addEventListener('click', this.inputBtnHandler.bind(this));

      this.container.append(inputFieldsContainer);
    });
  }

  private renderCarControlBtns():void {
    const btnsControlContainer = createBlock({
      tag: 'div',
      className: 'control-btns-container',
    });

    const carControlBtnsCategories = ['race', 'reset', 'generate'];
    const btnRace = createBlock({
      tag: 'div',
      className: 'control-btns-container__btn btn btn_race',
      innerHTML: 'race',
      parentBlock: btnsControlContainer,
    });
    const btnReset = createBlock({
      tag: 'div',
      className: 'control-btns-container__btn btn btn_reset',
      innerHTML: 'reset',
      parentBlock: btnsControlContainer,
    });
    const btnGenerate = createBlock({
      tag: 'div',
      className: 'control-btns-container__btn btn btn_generate',
      innerHTML: 'generate',
      parentBlock: btnsControlContainer,
    });
    btnGenerate.addEventListener('click', this.btnGenerateHandler.bind(this));
    this.container.append(btnsControlContainer);
  }

  private async btnGenerateHandler(e: Event): Promise<void> {
    const carsData = generateCars();
    const carsContainer: HTMLDivElement = findElement('.cars-container');
    await this.garage.renderCars(carsContainer, carsData);
    await this.garage.rerenderCarsNumber();
  }

  private async inputBtnHandler(e: Event): Promise<HTMLElement | null> {
    const carsContainer: HTMLDivElement = findElement('.cars-container');

    const { target } = e;
    if (target && target instanceof HTMLElement) {
      const category = target.innerHTML;
      const inputName: HTMLInputElement = findElement(`.input-text_${category}`);

      if (!inputName.value) {
        return null;
      }

      const inputColorPicker: HTMLInputElement = findElement(`.input-color-picker_${category}`);
      const inputBtn: HTMLButtonElement = findElement(`.btn_${category}`);

      const newCarData = {
        name: inputName.value,
        color: inputColorPicker.value,
      };

      let newCar: CarData;
      let carContainer: HTMLDivElement;

      if (category === InputCategories.Create) {
        this.api.createCar(newCarData);
        const cars = await this.api.getCars();
        newCar = cars[cars.length - 1];
        carContainer = createBlock({
          tag: 'div',
          className: 'car',
          parentBlock: carsContainer,
        });
        await this.garage.rerenderCarsNumber();
      } else {
        const id = Garage.selectedCarID;
        newCar = await this.api.updateCar(id, newCarData);
        carContainer = findElement(`[id='${id}']`);
        console.log(carContainer);
        carContainer.innerHTML = '';
        inputName.disabled = true;
        inputColorPicker.disabled = true;
        inputBtn.disabled = true;
      }

      this.garage.renderCar(newCar, carContainer);
      inputName.value = '';
      inputColorPicker.value = '';
    }
    return carsContainer;
  }
}

export default Settings;
