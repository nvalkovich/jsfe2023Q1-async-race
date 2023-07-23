import { PageIds } from '../types/enums';
import Component from './component';
import { createBlock } from './helpers';

const buttons = [
  {
    id: PageIds.Garage,
    text: 'garage  ',
  },
  {
    id: PageIds.Winners,
    text: 'winners  ',
  },
];

class HeaderButtons extends Component {
  public render(): HTMLElement {
    const headerBtnsContainer = document.createElement('div');
    headerBtnsContainer.className = 'header__header-btns header-btns';
    buttons.forEach((button) => {
      const buttonHTML = createBlock({
        tag: 'a',
        className: 'header-btns__btn btn',
        innerHTML: button.text,
        parentBlock: headerBtnsContainer,
      });
      buttonHTML.href = `#${button.id}`;
    });
    this.container.append(headerBtnsContainer);
    return this.container;
  }
}

export default HeaderButtons;
