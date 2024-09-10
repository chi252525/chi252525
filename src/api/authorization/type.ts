export interface IPostLoginResponse {
  username: string;
  accessToken: string;
  refreshToken: null | string;
  tokenType: string;
}

interface IEmployee {
  organizationId: string;
  no: string;
  chName: string;
  enName: string;
  title: string;
}

interface IAcccount {
  username: string;
  displayName: string;
}
export interface IPersonalInfoResponse {
  account: IAcccount;
  employee: IEmployee;
}

interface IRoles {
  code: string;
  name: string;
  bitIndex: number;
  description: string;
}
interface IPermissions {
  code: string;
  name: string;
  bitIndex: number;
  description: string;
}

export interface IPersonalAuthResponse {
  roles: Array<IRoles>;
  permissions: Array<IPermissions>;
}

export interface IAnonymousResponse {
  name: string;
  logo: string;
}

export interface IOrganizationInfo {
  organizationId: null | string;
  code: string;
  name: string;
  nhiContractDate: string;
  countryCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
  phoneCountryCode: string;
  phoneAreaCode: string;
  phoneNumber: string;
  phoneExtension: string;
  contactPerson: string;
  contactTitle: string;
  contactPhoneCountryCode: string;
  contactPhoneAreaCode: string;
  contactPhoneNumber: string;
  logo: string;
  introduction: string;
  customUrl: string;
  tlmToken: string;
  tlmTokenExpireTime: string;
}

export interface hpcGetHPCSSNResponse {
  pBuffer: string;
}
