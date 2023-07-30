import { EngineStatus } from '../../types/enums';
import { CarCreateData } from '../../types/interfaces';

import Api from '../api/api';

const api = new Api();
const carBrands = ['Audi', 'Bentley', 'Citroen', 'Ferrari', 'Mazda', 'Opel', 'Nissan', 'Skoda', 'Volkswagen', 'Renault'];
const carModels = ['RS Q3', 'Mustang', '300 ZX', 'AMG GT C190 ', 'Citan', 'Aspire', 'ASX', 'Canter', '200 SX', 'Almera Tino'];

export const createBlock = <K extends keyof HTMLElementTagNameMap>(data: {
  tag: K,
  className?: string;
  innerHTML?: string;
  parentBlock?: HTMLElement;
}): HTMLElementTagNameMap[K] => {
  const {
    tag, className, innerHTML, parentBlock,
  } = data;

  const block = document.createElement(tag);

  if (className) {
    block.className = className;
  }
  if (innerHTML) {
    block.innerHTML = innerHTML;
  }
  if (parentBlock) {
    parentBlock.append(block);
  }

  return block;
};

export const findElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element for selector "${selector}" is not found`);
  }

  return element;
};

export const generateRandomNumber = (
  min: number,
  max: number,
): number => Math.floor(min + Math.random() * (max + 1 - min));

export const generateRandomColor = (): string => {
  const colorLenth = 6;
  const chars = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < colorLenth; i += 1) {
    color += chars[Math.floor(Math.random() * 16)];
  }

  return color;
};

export const generateCars = (): CarCreateData[] => {
  const carsNum = 100;
  const cars: string[] = [];
  const carsData: CarCreateData[] = [];

  while (cars.length < carsNum) {
    const randomBrandIndex = generateRandomNumber(0, carBrands.length - 1);
    const randomModelIndex = generateRandomNumber(0, carModels.length - 1);
    const car = `${carBrands[randomBrandIndex]} ${carModels[randomModelIndex]}`;

    if (!cars.includes(car)) {
      cars.push(car);

      const data: CarCreateData = {
        name: car,
        color: generateRandomColor(),
      };

      carsData.push(data);
      api.createCar(data);
    }
  }
  return carsData;
};

export const findElementCollections = (selector: string): NodeListOf<Element> => {
  const collection = document.querySelectorAll(selector);

  if (!collection) {
    throw new Error(`Elements for selector "${selector}" is not found`);
  }

  return collection;
};

export const getDuration = async (id: number): Promise<number | null> => {
  const duration = await api.setEngineStatus(id, EngineStatus.Start);

  if (duration && typeof (duration) === 'number') {
    return duration;
  }

  return null;
};

export const createCarSVG = (
  width: number,
  height: number,
  viewBox: string,
): string => `<svg width="${width}px" height="${height}px" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" fill="none" width="${width}" height="${height}"/>
  <g>
  <circle cx="14" cy="13.5" r="1.5"/>
  <path d="M16.1 9h-1.6c-.6-2.7-3.2-4.5-5.9-3.9C6.6 5.5 5 7 4.6 9h-.7c-1 0-1.9.9-1.9 1.9v1.3c0 .7.6 1.3 1.3 1.3h.3c0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4h3.2c0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4h.3c.7 0 1.3-.6 1.3-1.3V11c0-1.1-.9-2-1.9-2zM6.2 9c.5-1.9 2.5-2.9 4.3-2.4 1.1.3 2 1.2 2.4 2.4H6.2zM6 12c-.8 0-1.5.7-1.5 1.5S5.2 15 6 15s1.5-.7 1.5-1.5S6.8 12 6 12z"/>
  </g>
  </svg>`;

export const isPageNumCorrect = (
  pageNum: number,
  elementsNum: number,
  limit: number,
): boolean => Boolean(pageNum && pageNum <= Math.ceil(elementsNum / limit));
