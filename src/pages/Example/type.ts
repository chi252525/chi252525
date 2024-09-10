export interface ITableRowType {
  id: string | null;
  freqCode: string;
  freqCname: string;
  freqShortName: string;
  freqEname: string;
  freqInsuCode: number | string;
  freqTimes: number | string;
  freqCycleType: null | string;
  freqCycleNum: number | string;
  sortValue: number | string;
  stop: boolean | null;
  stopDateTime: null | string;
  modifiedBy: IAccountInfo | null;
  modifiedAt: string;
  createdAt: string;
  createdBy: IAccountInfo | null;
  giveDrugType?: string;
}

export interface IAccountInfo {
  admin: boolean;
  id: null | string;
  name: string;
}

export interface IDrugFreqList {
  content: Array<ITableRowType>;
  total_pages: number;
  total_elements: number;
  page: number;
  size: number;
  sort: Array<string>;
}

export interface IAddFreqDataMaintenanceRequest {
  freqCode: string;
  freqCname: string;
  page: number;
  rowsPerPage: number;
  sortBy: string;
  descending: boolean;
}

export interface IDivisionOption {
  modifiedAt: null | string;
  modifiedBy: IAccountInfo;
  createdAt: string;
  createdBy: IAccountInfo;
  stop: false;
  stopDateTime: null | string | Date;
  startDate: null | string;
  endDate: null | string;
  code: string;
  name: string;
  group: string;
  class1: null | string;
  class2: null | string;
  memo: null | string;
  visitClass: null | string;
}

export interface MyEventBus {
  emit: (event: string, ...args: any) => void;
  on: (event: string, callback: (...args: any) => void) => void;
  off: (event: string, callback?: (...args: any) => void) => void;
}
export interface EventPayload {
  page: number;
  rowsPerPage: number;
  sortBy: string;
  descending: boolean;
}
