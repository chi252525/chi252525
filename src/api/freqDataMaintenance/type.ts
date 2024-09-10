export interface IAccountInfo {
  admin: boolean;
  id: string | null;
  name: string;
}

export interface IFreqData {
  id: string | null;
  freqCode: string;
  freqCname: string;
  freqShortName: string;
  freqEname?: string;
  freqNameEn?: string;
  freqInsuCode: number | string;
  freqTimes: number | string;
  freqCycleType: number | string;
  freqCycleNum: number | string;
  giveDrugType?: string | null;
  sortValue: number | string;
  stop: boolean;
  stopDateTime: null | string;
  modifiedBy: IAccountInfo;
  modifiedAt: string;
  createdAt: string;
  createdBy: IAccountInfo;
}

export interface IDrugFreqListResponse {
  content: Array<IFreqData>;
  total_pages: number;
  total_elements: number;
  page: number;
  size: number;
  sort: Array<string>;
}
