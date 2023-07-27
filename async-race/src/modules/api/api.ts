import { CarData, UpdateWinnerData, WinnerData } from '../../types/interfaces';
import { EngineStatus } from '../../types/enums';

class Api {
  private baseURL: string;

  public static carsLimit = 7;

  public static winnersLimit = 10;

  private path:{ [key: string]: string };

  constructor() {
    this.baseURL = 'http://127.0.0.1:3000';
    this.path = {
      garage: '/garage',
      engine: '/engine',
      winners: '/winners',
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
    const query = this.getQueryString([{ key: 'page', value: `${page}` }, { key: 'limit', value: `${Api.carsLimit}` }]);
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

  public async removeCar(id: number):Promise<object | null> {
    try {
      const response = await fetch(`${this.baseURL}${this.path.garage}/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  public async setEngineStatus(id: number | undefined, status: EngineStatus): Promise<number> {
    const response = await fetch(`${this.baseURL}/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    const data = await response.json();
    const duration = data.distance / data.velocity;
    return duration;
  }

  public async setDriveStatus(id: number | undefined): Promise<null | { succes: boolean; }> {
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

  public async getWinner(id: number): Promise<WinnerData | null> {
    try {
      const response = await fetch(`${this.baseURL}${this.path.winners}/${id}`, {
        method: 'GET',
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

  public async createWinner(id: number, time: number): Promise<WinnerData | null> {
    const winner = await this.getWinner(id);

    const winsNumber = winner?.wins ? winner.wins + 1 : 1;

    const winnerData: WinnerData = {
      id,
      wins: winsNumber,
      time,
    };
    try {
      const response = await fetch(`${this.baseURL}${this.path.winners}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(winnerData),
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

  public async getWinners(
    pageNumber?: number,
    sortType?: string,
    sortOrder?: string,
  ): Promise<WinnerData[] | []> {
    let listWinners: WinnerData[] = [];
    const typeSort = sortType || 'id';
    const orderSort = sortOrder || 'ASC';
    try {
      let response: Response;
      if (pageNumber) {
        response = await fetch(`${this.baseURL}${this.path.winners}?_page=${pageNumber}&_limit=${Api.winnersLimit}&_sort=${typeSort}&_order=${orderSort}`, {
          method: 'GET',
        });
      } else {
        response = await fetch(`${this.baseURL}${this.path.winners}`, {
          method: 'GET',
        });
      }
      if (response.ok) {
        const responseData = await response.json();
        listWinners = Object.keys(responseData).map((key) => {
          const winnersData = responseData[key];
          const winner: WinnerData = {
            id: winnersData.id,
            wins: winnersData.wins,
            time: winnersData.time,
          };
          return winner;
        });
      }
    } catch (error) {
      console.error(`Can't get winners: ${error}`);
    }
    return listWinners;
  }

  public async updateWinner(oldData: WinnerData, time: number): Promise<WinnerData | null> {
    try {
      const { id, wins } = oldData;
      const bestTime = oldData.time < time ? oldData.time : time;
      const newData: UpdateWinnerData = {
        wins: wins + 1,
        time: bestTime,
      };
      const response = await fetch(`${this.baseURL}${this.path.winners}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error(`Can't create winner: ${error}`);
    }
    return null;
  }

  public async removeWinner(id: number): Promise<object | null> {
    try {
      const response = await fetch(`${this.baseURL}${this.path.winners}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}

export default Api;
