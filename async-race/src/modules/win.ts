import Api from './api';
import { findElement, createBlock } from './helpers';

class Win {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  public async renderWin(id: number, name: string, time: number): Promise<void> {
    const body: HTMLBodyElement = findElement('body');
    const message = createBlock({
      tag: 'div',
      className: 'win-message',
      parentBlock: body,
    });
    const messageText = createBlock({
      tag: 'h3',
      className: 'win-message__text',
      innerHTML: `${name} is winner! (${time}s)`,
      parentBlock: message,
    });

    setTimeout(() => {
      body.removeChild(message);
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
