import { PageIds } from '../../types/enums';
import Component from '../templates/component';
import { createBlock } from '../helpers/helpers';

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
      const headerButton = createBlock({
        tag: 'button',
        className: 'header-btns__btn btn btn',
        parentBlock: headerBtnsContainer,
      });
      const buttonLink = createBlock({
        tag: 'a',
        className: `header-btns__btn btn__link btn__link_${button.text}`,
        innerHTML: button.text,
        parentBlock: headerButton,
      });
      buttonLink.href = `#${button.id}`;
    });
    this.container.append(headerBtnsContainer);
    return this.container;
  }
}

export default HeaderButtons;
