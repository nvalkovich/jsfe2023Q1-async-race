import Component from './component';
import createBlock from './helpers';

const inputFieldsCategories = ['create', 'update'];
const carControlBtnsCategories = ['race', 'reset', 'generate'];

class Settings extends Component {
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
      const input = createBlock({
        tag: 'input',
        className: `input input_${category}`,
        parentBlock: inputField,
      });
      const selectColorField = createBlock({
        tag: 'div',
        className: `select-color-field select-color-field_${category}`,
        parentBlock: inputField,
      });
      const inputBtn = createBlock({
        tag: 'div',
        className: `input-container__btn btn btn_${category}`,
        innerHTML: `${category}`,
        parentBlock: inputField,
      });

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
