import { createBlock } from '../helpers/helpers';

abstract class Component {
  protected container: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    this.container = createBlock({
      tag,
      className,
    });
  }
}

export default Component;
