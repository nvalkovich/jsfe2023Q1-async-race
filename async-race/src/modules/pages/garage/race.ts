import { animate, stopAnimate } from './animation';
import { findElement } from '../../helpers/helpers';
import { EngineStatus } from '../../../types/enums';
import { CarData } from '../../../types/interfaces';

import Api from '../../api/api';
import Win from './win';
import { parseLocalStorage, stringifyLocalStorage } from '../../../state/localstorage';
import { activateBtnsAfterRace } from '../../../state/state';

const api = new Api();

class Race {
  public winnerID: number | undefined;

  public win: Win;

  constructor() {
    this.winnerID = undefined;
    this.win = new Win();
  }

  public async startRace(
    id: number | undefined,
    status: EngineStatus,
    duration?: number,
    carsOnPage?: [CarData],
  ): Promise<void> {
    const car: HTMLDivElement = findElement(`[id='${id}'] .car-drive__image`);
    const carStartBtn: HTMLButtonElement = findElement(`[id='${id}'] .btn_start`);
    const carStopBtn: HTMLButtonElement = findElement(`[id='${id}'] .btn_stop`);
    const raceBtn: HTMLButtonElement = findElement('.btn_race');

    if (status === EngineStatus.Start && duration) {
      stringifyLocalStorage('stoppedCars', 0);
      carStartBtn.disabled = true;
      carStopBtn.disabled = false;
      raceBtn.disabled = true;

      animate(duration, id, car);
      const drive = await api.setDriveStatus(id);

      if (drive && !this.winnerID && id && carsOnPage) {
        this.winnerID = id;
        const time = Number((duration / 1000).toFixed(2));
        const winnerCar = await api.getCar(id);
        this.win.renderWin(this.winnerID, winnerCar.name, time);
        carsOnPage.forEach((el) => {
          stopAnimate(el.id);
        });
      }
      if (!drive) {
        const currentGaragePage: number | null = parseLocalStorage('currentGaragePage') || 1;
        const cars = await api.getCarsFromPage(currentGaragePage);

        const currentStoppedCars: number | null = parseLocalStorage('stoppedCars') || 0;
        if (currentStoppedCars < cars.length) {
          stringifyLocalStorage('stoppedCars', currentStoppedCars + 1);
        }

        const stoppedCars: number | null = parseLocalStorage('stoppedCars') || 0;
        if (stoppedCars === cars.length) {
          activateBtnsAfterRace();
        }
        stopAnimate(id);
      }
    } else if (status === EngineStatus.Stop) {
      stopAnimate(id, car);
      carStartBtn.disabled = false;
      carStopBtn.disabled = true;
      activateBtnsAfterRace();
    }
  }
}

export default Race;
