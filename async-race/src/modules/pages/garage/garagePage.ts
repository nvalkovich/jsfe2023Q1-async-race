import Page from '../page';
import Settings from '../../settings';
import Garage from '../../garage';

class GaragePage extends Page {
  private cars = new Garage('div', 'cars');

  private settings = new Settings('div', 'settings');

  public render():HTMLElement {
    const settingsBlock = this.settings.render();
    this.container.append(settingsBlock);
    this.renderCars();
    return this.container;
  }

  public async renderCars():Promise<HTMLElement> {
    const carsBlock = await this.cars.render();
    this.container.append(carsBlock);
    return this.container;
  }
}

export default GaragePage;
