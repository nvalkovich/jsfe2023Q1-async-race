import Component from './component';
import { createBlock, findElement } from './helpers';
import { InputCategories } from '../types/enums';
import Garage from './garage';
import Api from './api';

const inputFieldsCategories = Object.values(InputCategories);
const carControlBtnsCategories = ['race', 'reset', 'generate'];

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
        tag: 'div',
        className: `input-container__btn btn btn_${category}`,
        innerHTML: `${category}`,
        parentBlock: inputField,
      });

      inputBtn.addEventListener('click', this.inputBtnHandler.bind(this));

      this.container.append(inputFieldsContainer);
    });
  }

  private renderCarControlBtns():void {
    const btnsControlContainer = createBlock({
      tag: 'div',
      className: 'control-btns-container',
    });
    carControlBtnsCategories.forEach((category) => {
      const btn = createBlock({
        tag: 'div',
        className: `control-btns-container__btn btn btn_${category}`,
        innerHTML: `${category}`,
        parentBlock: btnsControlContainer,
      });
    });
    this.container.append(btnsControlContainer);
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

      if (category === InputCategories.Create) {
        this.api.createCar({
          name: inputName.value,
          color: inputColorPicker.value,
        });

        const cars = await this.api.getCars();
        const lastCar = cars[cars.length - 1];
        const newCar = this.garage.renderCar(lastCar);
        carsContainer.append(newCar);
        await this.garage.rerenderCarsNumber();
      }
      inputName.value = '';
      inputColorPicker.value = '';
    }
    return carsContainer;
  }
}

export default Settings;
