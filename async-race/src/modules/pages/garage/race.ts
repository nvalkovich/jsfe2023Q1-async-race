import { startAnimation, stopAnimate } from './animation';
import { findElement } from '../../helpers/helpers';
import { EngineStatus } from '../../../types/enums';
import { CarData } from '../../../types/interfaces';

import Api from '../../api/api';
import Win from './win';
import { parseLocalStorage, stringifyLocalStorage } from '../../../state/localstorage';
import { activateBtnsAfterRace } from '../../../state/state';

const api = new Api();
const msPerSec = 1000;

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
      carStartBtn.disabled = true;
      carStopBtn.disabled = false;
      raceBtn.disabled = true;

      stringifyLocalStorage('stoppedCars', 0);
      startAnimation(duration, id, car);

      const drive = await api.setEngineStatus(id);

      if (drive && !this.winnerID && id && carsOnPage) {
        const time = Number((duration / msPerSec).toFixed(2));
        const winnerCar = await api.getCar(id);

        this.winnerID = id;
        this.win.renderWin(this.winnerID, winnerCar.name, time);

        carsOnPage.forEach((el) => {
          stopAnimate(el.id);
        });
      }
      if (!drive) {
        const currentGaragePage: number | null = parseLocalStorage('currentGaragePage') || 1;
        const currentStoppedCars: number | null = parseLocalStorage('stoppedCars') || 0;
        const cars = await api.getCarsFromPage(currentGaragePage);

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
      carStartBtn.disabled = false;
      carStopBtn.disabled = true;
      stopAnimate(id, car);
      activateBtnsAfterRace();
    }
  }
}

export default Race;
