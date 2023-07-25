// eslint-disable-next-line import/no-cycle
import { animate, stopAnimate } from './animation';
import { findElement } from './helpers';
import { EngineStatus } from '../types/enums';
import CarData from '../types/interfaces';

import Api from './api';
import Win from './win';

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
    if (status === EngineStatus.Start && duration) {
      carStartBtn.disabled = true;
      carStopBtn.disabled = false;
      animate(duration, id, car);
      const drive = await api.setDriveStatus(id);
      if (drive && !this.winnerID && id && carsOnPage) {
        this.winnerID = id;
        const time = (duration / 1000).toFixed(2);
        const winnerCar = await api.getCar(id);
        this.win.renderWin(winnerCar.name, time);
        carsOnPage.forEach((el) => {
          stopAnimate(el.id);
        });
      }
      if (!drive) {
        stopAnimate(id);
      }
    } else if (status === EngineStatus.Stop) {
      stopAnimate(id, car);
      carStartBtn.disabled = false;
      carStopBtn.disabled = true;
    }
  }
}

export default Race;
