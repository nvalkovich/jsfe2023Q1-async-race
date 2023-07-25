// eslint-disable-next-line import/no-cycle
import { animate, stopAnimate } from './animation';
import { findElement } from './helpers';
import { EngineStatus } from '../types/enums';

import Api from './api';

const api = new Api();

const startRace = async (
  id: number,
  status: EngineStatus,
  duration?: number,
): Promise<void> => {
  const car: HTMLDivElement = findElement(`[id='${id}'] .car-drive__image`);
  const carStartBtn: HTMLButtonElement = findElement(`[id='${id}'] .btn_start`);
  const carStopBtn: HTMLButtonElement = findElement(`[id='${id}'] .btn_stop`);
  if (status === EngineStatus.Start && duration) {
    carStartBtn.disabled = true;
    carStopBtn.disabled = false;
    animate(duration, id, car);
    const drive = await api.setDriveStatus(id);
    if (!drive) {
      stopAnimate(id);
    }
  } else if (status === EngineStatus.Stop) {
    stopAnimate(id, car);
    carStartBtn.disabled = false;
    carStopBtn.disabled = true;
  }
};

export default startRace;
