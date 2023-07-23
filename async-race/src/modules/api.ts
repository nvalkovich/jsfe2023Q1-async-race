import { CarData } from '../types/interfaces';

class Api {
  private baseURL: string;

  private path:{ [key: string]: string };

  constructor() {
    this.baseURL = 'http://127.0.0.1:3000';
    this.path = {
      garage: '/garage',
    };
  }

  public async createCar(data: CarData | object = {}):Promise<[CarData]> {
    const response = await fetch(`${this.baseURL}${this.path.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public getQueryString(queryParams: { key : string, value: string }[]):string {
    let string = '';
    if (queryParams.length) {
      string = `?${
        queryParams.map((x):string => `${x.key}=${x.value}`).join('&')}`;
    }
    return string;
  }

  public async getCars():Promise<[CarData]> {
    const query = this.getQueryString([{ key: 'page', value: '1' }, { key: 'limit', value: '1' }]);
    const response: Response = await fetch(`${this.baseURL}${this.path.garage}${query}`);
    const data = response.json();
    return data;
  }

  public async getCar(id: number):Promise<CarData> {
    const response = await fetch(`${this.baseURL}${this.path.garage}/${id}`);
    return response.json();
  }

  public async updateCar(id: number, data: { [key: string]: string }):Promise<CarData> {
    const response = await fetch(`${this.baseURL}${this.path.garage}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public async removeCar(id: number):Promise<object> {
    const response = await fetch(`${this.baseURL}${this.path.garage}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export default Api;
