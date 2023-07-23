import Component from './component';
import { createBlock, findElement } from './helpers';
import inputBtnHandler from './handlers';
import { InputCategories } from '../types/enums';

const inputFieldsCategories = Object.values(InputCategories);
console.log(inputFieldsCategories);
const carControlBtnsCategories = ['race', 'reset', 'generate'];

class Settings extends Component {
  public render():HTMLElement {
    this.renderInputFields();
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

      inputBtn.addEventListener('click', inputBtnHandler);

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
}

export default Settings;
