import { CarCreateData, CarData } from '../types/interfaces';

import Api from './api';

const api = new Api();

export const createBlock = <K extends keyof HTMLElementTagNameMap>(data: {
  tag: K,
  className?: string;
  innerHTML?: string;
  parentBlock?: HTMLElement;
})
  : HTMLElementTagNameMap[K] => {
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

export const generateRandomNumber = (min:number, max: number)
:number => Math.floor(min + Math.random() * (max + 1 - min));

export const generateRandomColor = ()
:string => {
  const colorLenth = 6;
  const chars = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < colorLenth; i += 1) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
};

const carBrands = ['Audi', 'Bentley', 'Citroen', 'Ferrari', 'Mazda', 'Opel', 'Nissan', 'Skoda', 'Volkswagen', 'Renault'];
const carModels = ['RS Q3', 'Mustang', '300 ZX', 'AMG GT C190 ', 'Citan', 'Aspire', 'ASX', 'Canter', '200 SX', 'Almera Tino'];

export const generateCars = (): CarCreateData[] => {
  const carsNum = 100;
  const cars: string[] = [];
  const carsData: CarCreateData[] = [];
  while (cars.length < carsNum) {
    const randomBrandIndex = generateRandomNumber(0, carBrands.length - 1);
    const randomModelIndex = generateRandomNumber(0, carModels.length - 1);
    console.log(randomBrandIndex, randomModelIndex);
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
