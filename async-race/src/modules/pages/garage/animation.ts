import { findElement } from '../../helpers/helpers';

const animationId: { [key: string]: number } = {};
const carImageSize = 60;
const rightIndent = 160;

const renderAnimation = (progress: number, carElement: HTMLDivElement): void => {
  const carDriveContainer: HTMLElement = findElement('.car-drive');
  const widthScreen: number = carDriveContainer.clientWidth - rightIndent;
  const car = carElement;
  car.style.left = `${carImageSize + progress * widthScreen}px`;
};

const timing = (timeFraction: number): number => timeFraction;

export const startAnimation = (
  duration: number,
  id: number | undefined,
  car: HTMLDivElement,
)
: number => {
  const start: number = performance.now();

  const animate = (time: number): void => {
    let timeFraction: number = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    const progress: number = timing(timeFraction);

    renderAnimation(progress, car);

    if (timeFraction < 1 && id) {
      animationId[id] = requestAnimationFrame(animate);
    }
  };

  return requestAnimationFrame(animate);
};

export const stopAnimate = (id: number | undefined, carElement?: HTMLDivElement): void => {
  if (id) {
    cancelAnimationFrame(animationId[id]);
    if (carElement) {
      const car = carElement;
      car.style.left = `${carImageSize}px`;
    }
  }
};
