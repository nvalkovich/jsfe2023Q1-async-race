import Api from '../../api/api';
import { findElement, createBlock } from '../../helpers/helpers';

class Win {
  private api: Api;

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

    setTimeout(() => {
      body.removeChild(messageContainer);
    }, 3000);

    const winner = await this.api.getWinner(id);
    if (winner) {
      this.api.updateWinner(winner, time);
    } else {
      this.api.createWinner(id, time);
    }
  }
}

export default Win;
