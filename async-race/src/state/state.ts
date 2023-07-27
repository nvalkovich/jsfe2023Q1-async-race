import { findElementCollections } from '../modules/helpers/helpers';
import { removeLocalStorage, setLocalStorage, stringifyLocalStorage } from './localstorage';

export const setSelectedState = (id: number, name: string, color: string): void => {
  setLocalStorage('updateInputText', name);
  setLocalStorage('updateInputColor', color);
  stringifyLocalStorage('selectedCarID', id);
};

export const removeSelectedState = (): void => {
  removeLocalStorage('updateInputText');
  removeLocalStorage('updateInputColor');
  removeLocalStorage('selectedCarID');
};

export const removeCreateState = (): void => {
  removeLocalStorage('createInputText');
  removeLocalStorage('createInputColor');
};

export const disableBtnsForRace = ():void => {
  const buttons = findElementCollections('button');
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons[i] as HTMLButtonElement;
    button.disabled = true;
  }
};

export const activateBtnsAfterRace = ():void => {
  const buttons = findElementCollections('button');
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons[i] as HTMLButtonElement;
    button.disabled = false;
  }
};
