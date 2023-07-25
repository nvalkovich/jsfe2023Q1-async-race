import { findElement, createBlock } from './helpers';

class Win {
  public renderWin(name: string, time: string): void {
    const body: HTMLBodyElement = findElement('body');
    const message = createBlock({
      tag: 'div',
      className: 'win-message',
      parentBlock: body,
    });
    const messageText = createBlock({
      tag: 'h3',
      className: 'win-message__text',
      innerHTML: `${name} won the race (${time}s)`,
      parentBlock: message,
    });

    setTimeout(() => {
      body.removeChild(message);
    }, 3000);
  }
}

export default Win;
