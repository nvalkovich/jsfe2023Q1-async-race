import { findElement } from '../../helpers/helpers';

const animationId: { [key: string]: number } = {};

const renderAnimation = (progress: number, carElement: HTMLDivElement): void => {
  const carDriveContainer: HTMLElement = findElement('.car-drive');
  const widthScreen: number = carDriveContainer.clientWidth - 160;
  const car = carElement;
  car.style.left = `${60 + progress * widthScreen}px`;
};

const timing = (timeFraction: number): number => timeFraction;

export const animate = (duration: number, id: number | undefined, car: HTMLDivElement): number => {
  const start: number = performance.now();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  return requestAnimationFrame(function animate(time: number): void {
    let timeFraction: number = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    const progress: number = timing(timeFraction);

    renderAnimation(progress, car);

    if (timeFraction < 1 && id) {
      animationId[id] = requestAnimationFrame(animate);
    }
  });
};

export const stopAnimate = (id: number | undefined, carElement?: HTMLDivElement): void => {
  if (id) {
    cancelAnimationFrame(animationId[id]);
    if (carElement) {
      const car = carElement;
      car.style.left = `${60}px`;
    }
  }
};
