import { getLocalStorage } from '../../../state/localstorage';
import Api from '../../api/api';
import { findElement, createBlock, findElementCollections } from '../../helpers/helpers';

class Win {
  private api: Api;

  private winnersMessageShowTime = 3000;

  constructor() {
    this.api = new Api();
  }

  public async renderWin(id: number, name: string, time: number): Promise<void> {
    const body: HTMLBodyElement = findElement('body');

    const messageContainer = createBlock({
      tag: 'div',
      className: 'win-message-container',
      parentBlock: body,
    });

    const message = createBlock({
      tag: 'div',
      className: 'win-message',
      parentBlock: messageContainer,
    });

    const messageText = createBlock({
      tag: 'h3',
      className: 'win-message__text',
      innerHTML: `${name} is winner! (${time}s)`,
      parentBlock: message,
    });

    this.activateBtns();

    setTimeout(() => {
      body.removeChild(messageContainer);
    }, this.winnersMessageShowTime);

    const winner = await this.api.getWinner(id);

    if (winner) {
      this.api.updateWinner(winner, time);
    } else {
      this.api.createWinner(id, time);
    }
  }

  public activateBtns(): void {
    const buttons = findElementCollections('button');

    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons[i] as HTMLButtonElement;

      button.disabled = false;

      const garagePage = Number(getLocalStorage('currentGaragePage'));
      const garageCarsNumber = Number(getLocalStorage('garageCarsNumber'));

      if (button.classList.contains('btn_next') && garagePage === Math.ceil(garageCarsNumber / Api.carsLimit)) {
        button.disabled = true;
      }

      if (button.classList.contains('btn_prev') && garagePage === 1) {
        button.disabled = true;
      }
    }
  }
}

export default Win;
