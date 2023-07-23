import { findElement } from './helpers';
import { InputCategories } from '../types/enums';
import Api from './api';
import Garage from './garage';

const api = new Api();
const garage = new Garage('div', 'cars');

const inputBtnHandler = async (e: Event): Promise<HTMLElement | null> => {
  console.log(e.target);
  const carsContainer: HTMLDivElement = findElement('.cars-container');

  const { target } = e;
  if (target && target instanceof HTMLElement) {
    const category = target.innerHTML;
    const inputName: HTMLInputElement = findElement(`.input-text_${category}`);

    if (!inputName) {
      return null;
    }

    const inputColorPicker: HTMLInputElement = findElement(`.input-color-picker_${category}`);

    if (category === InputCategories.Create) {
      const newCarData = {
        name: inputName.value,
        color: inputColorPicker.value,
      };
      api.createCar(newCarData);
      const newCar = garage.renderCar(newCarData);
      carsContainer.append(newCar);
      await garage.updateCarsData();
      await garage.setCarsNumber();
      garage.renderCarsNumber();
    }
    inputName.value = '';
    inputColorPicker.value = '';
  }
  return carsContainer;
};

export default inputBtnHandler;
