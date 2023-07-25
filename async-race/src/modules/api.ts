import CarData from '../types/interfaces';
import { EngineStatus } from '../types/enums';

class Api {
  private baseURL: string;

  private limit: number;

  private path:{ [key: string]: string };

  constructor() {
    this.baseURL = 'http://127.0.0.1:3000';
    this.path = {
      garage: '/garage',
    };
    this.limit = 7;
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
        queryParams.map((x):string => `_${x.key}=${x.value}`).join('&')}`;
    }
    return string;
  }

  public async getCars():Promise<[CarData]> {
    const response: Response = await fetch(`${this.baseURL}${this.path.garage}`);
    const data = response.json();
    return data;
  }

  public async getCarsFromPage(page: number):Promise<[CarData]> {
    const query = this.getQueryString([{ key: 'page', value: `${page}` }, { key: 'limit', value: `${this.limit}` }]);
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

  public async setEngineStatus(id: number, status: EngineStatus): Promise<number> {
    const response = await fetch(`${this.baseURL}/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    const data = await response.json();
    const duration = data.distance / data.velocity;
    return duration;
  }

  public async setDriveStatus(id: number): Promise<null | { succes: boolean; }> {
    try {
      const response = await fetch(`${this.baseURL}/engine?id=${id}&status=${EngineStatus.Drive}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}

export default Api;
