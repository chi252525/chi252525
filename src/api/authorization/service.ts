import { api } from 'src/boot/axios';
import type {
  IPostLoginResponse,
  IPersonalInfoResponse,
  IPersonalAuthResponse,
  IAnonymousResponse,
  IOrganizationInfo,
} from './type';

export const login = (
  params: { username: string; password: string },
  orgId: string
) => {
  return api.post<IPostLoginResponse>('/auth/login', params, {
    headers: {
      orgId: orgId,
    },
  });
};

export const loginCard = (params: { idNumber: string }, orgId: string) => {
  return api.post<IPostLoginResponse>('/auth/id-login', params, {
    headers: {
      orgId: orgId,
    },
  });
};

export const otpApi = (params: string, orgId: string) => {
  return api.get(`/auth/otp?${params}`, {
    headers: {
      orgId: orgId,
    },
  });
};

export const personalAuth = () => {
  return api.get<IPersonalAuthResponse>('/personal/auth/');
};

export const personalInfo = () => {
  return api.get<IPersonalInfoResponse>('/personal/info');
};

export const getLogoName = (uuid: string) => {
  return api.get<IAnonymousResponse>(
    `/rest/anonymous/organization/${uuid}/name-and-logo`
  );
};

export const getOrganizationInfoByCustomUrl = (customUrl: string) => {
  return api.get<IOrganizationInfo>(`/rest/anonymous/customLogin/${customUrl}`);
};

export const organizationInfo = (uuid: string) => {
  return api.get<IOrganizationInfo>(`/organization-info/${uuid}`);
};
