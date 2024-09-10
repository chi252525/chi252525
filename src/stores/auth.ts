import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { personalAuth } from 'src/api/authorization/service';
import { isAxiosError } from 'axios';
import router from 'src/router';

export const useAuthStore = defineStore('authStore', () => {
  interface IUserData {
    username: string;
    accessToken: null | string;
    refreshToken: null | string;
    tokenType: string;
    exp: Date | null;
    iat: Date | null;
    iss: string;
    jti: string;
    orgId: string;
    bitPermissionMask: Array<string>;
    sub: string;
    employee: IEmployee;
    roles: Array<string>;
    permissionsRoles: Array<IRoles>;
    permissionsAPI: Array<IPermissions>;
  }

  interface IEmployee {
    organizationId: string;
    no: string;
    chName: string;
    enName: string;
    title: string;
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

  interface IPermissionsFormat {
    code: string;
    name: string;
    action: Array<string>;
  }

  const user = ref<IUserData>({
    accessToken: null,
    bitPermissionMask: [],
    orgId: '',
    username: '',
    refreshToken: '',
    tokenType: '',
    exp: null,
    iat: null,
    iss: '',
    jti: '',
    sub: '',
    employee: {
      organizationId: '',
      no: '',
      chName: '',
      enName: '',
      title: '',
    },
    permissionsAPI: [],
    permissionsRoles: [],
    roles: [],
  });

  //根據API 分次Partial塞入不同的值
  function updateUserInfo(updates: Partial<IUserData>) {
    user.value = { ...user.value, ...updates };
  }

  function isLoggedIn() {
    return user.value.accessToken !== '';
  }

  async function getPermission() {
    try {
      const { data } = await personalAuth();
      user.value.permissionsAPI = data.permissions;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 500) {
            user.value.permissionsAPI = [];
            Notify.create({
              type: 'negative',
              message: '請重新登入',
            });
          } else {
            console.log('authStore 取得 Menu 失敗', error);
          }
        }
      }
    }
  }

  const permissions = computed<IPermissionsFormat[]>(() => {
    return user.value.permissionsAPI.reduce<IPermissionsFormat[]>(
      (acc, item) => {
        const code = item.code.split('_')[0].substring(1);
        const action = item.code.split('_')[1];
        const name = item.name.split(' ')[0];
        const existing = acc.find((o) => o.code === code && o.name === name);
        if (existing) {
          if (!existing.action.includes(action)) {
            existing.action.push(action);
          }
        } else {
          acc.push({ code, action: [action], name });
        }
        return acc;
      },
      []
    );
  });

  //登出
  async function logout() {
    router.replace(`/login?uuid=${user.value.orgId}`);
    user.value = {
      accessToken: null,
      bitPermissionMask: [],
      orgId: '',
      username: '',
      refreshToken: '',
      tokenType: '',
      exp: null,
      iat: null,
      iss: '',
      jti: '',
      sub: '',
      employee: {
        organizationId: '',
        no: '',
        chName: '',
        enName: '',
        title: '',
      },
      permissionsAPI: [],
      permissionsRoles: [],
      roles: [],
    };
  }

  return {
    user,
    updateUserInfo,
    logout,
    isLoggedIn,
    permissions,
    getPermission,
  };
});
