export interface CarData {
  'name': string,
  'color': string,
  'id': number,
}

export interface CarCreateData {
  'name': string,
  'color': string,
}

export interface WinnerData {
  id: number,
  wins: number,
  time: number
}

export interface UpdateWinnerData {
  wins: number,
  time: number
}
