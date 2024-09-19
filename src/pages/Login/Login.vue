<template>
  <div
    class="row justify-center items-center container"
    :class="{ 'q-pa-md': $q.screen.lt.md }"
    align="center"
  >
    <CIView />
    <q-card class="shadow-5 container-login">
      <img :src="checkLogoNull" style="width: 72px; height: 67.62px" />
      <span class="text-center textSize-h2">{{ clinicName }}</span>
      <q-card-section>
        <q-form class="" @submit="onSubmit" @reset="onReset">
          <div
            :class="`row justify-between items-start ${
              $q.screen.lt.md ? '' : 'no-wrap'
            }`"
          >
            <q-input
              v-model="account"
              :type="isAccount ? 'password' : 'text'"
              class="col-12 col-md-8 q-mr-sm q-mb-md textSize-16 is_require"
              outlined
              clearable
              label="帳號"
              placeholder="手機號碼"
              :rules="[
                account || isOpenCom
                  ? rules.validateLogin
                  : rules.require('帳號'),
              ]"
              hide-bottom-space
              ><template v-slot:append>
                <q-icon
                  :name="isAccount ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isAccount = !isAccount"
                />
              </template>
            </q-input>
            <q-btn
              :disable="isOTPRequest"
              class="col-12 col-md-4 textSize-16"
              color="primary"
              outline
              label="取得密碼"
              @click="getOTP()"
            />
          </div>

          <q-input
            v-model="otp"
            :type="isPwd ? 'password' : 'text'"
            class="col-12 textSize-16 is_require"
            :class="{ 'q-mt-md': $q.screen.lt.md }"
            outlined
            clearable
            label="密碼"
            placeholder="SMS OTP"
            ><template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="row justify-start items-center q-mt-md">
            <q-checkbox
              v-model="rememberAccount"
              label="記住帳號"
              class="textSize-16"
            />
          </div>

          <div class="row no-wrap justify-between items-center q-mt-lg">
            <q-btn
              outline
              label="清除"
              type="reset"
              color="primary"
              class="col-6 q-mr-sm textSize-16 guide-btn"
            />
            <q-btn
              rounded
              label="登入"
              :loading="loginButton"
              type="submit"
              color="accent"
              class="col-6 textSize-16 guide-btn"
              ><template v-slot:loading>
                <q-spinner />　等待連線...</template
              ></q-btn
            >
          </div>
        </q-form>
      </q-card-section>
      <q-inner-loading :showing="isLogin">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
    </q-card>

    <div class="row justify-center items-center container-fet">
      <img class="q-mr-sm" src="~/assets/images/null-logo.jpg" alt="" />
      <span class="text-info"></span>
      <span class="text-info">(Version: {{ version }})</span>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';

// XSS 攻擊
// const isValidPath = (path: string) => {
//   const regex = /^([a-zA-Z0-9\-_]+)$/;
//   const match = path.match(regex);
//   return match ? match[1] : null;
// };

// export default {
//   async beforeRouteEnter(to, next) {
//   },
// };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import CIView from 'components/CIView.vue';
import {
  login,
  loginCard,
  otpApi,
  personalAuth,
  personalInfo,
} from 'src/api/authorization/service';
import { useAuthStore } from 'src/stores/auth';
import { rules } from '../../utils/rules';
import { jwtDecode } from 'jwt-decode';
import { token } from './type';
import { useDialog } from 'src/composable/AlertDialog';

import nullLogo from 'src/assets/images/null-logo.jpg';
import { version } from 'src/../package.json';

const authStore = useAuthStore();
const base64Image = ref('');
const checkLogoNull = computed(() => {
  return base64Image.value ? base64Image.value : nullLogo;
});
const clinicName = ref('');
const $q = useQuasar();
const isAccount = ref(true);
const isPwd = ref(true);
const account = ref('');
const otp = ref('');
const accept = ref(false);
const rememberAccount = ref(false);
const isOTPRequest = ref(false);
const { showNoticeMessage, confirmMessage } = useDialog();
const router = useRouter();

const handleRoute = async () => {
  if (authStore.user.accessToken) {
    await router.replace('/home');
  }
};

async function getOTP() {
  isOTPRequest.value = true;
  const orgId = localStorage.getItem('orgId');
  if (account.value !== '' && accept.value !== null && orgId) {
    const queryParams = new URLSearchParams();
    queryParams.append('mobile', account.value);
    try {
      const response = await otpApi(queryParams.toString(), orgId);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 429) {
            confirmMessage({
              type: 'negative',
              deleteConfirmStatus: true,
              message: '密碼已發送，如果沒有收到，請稍候再重新取得',
              content: '',
            });
          } else {
            console.log(error);
          }
        }
      }
    }
  }
  isOTPRequest.value = false;
}
const isLogin = ref<boolean>(false);
const isOpenCom = ref<boolean>(false);
const loginButton = ref(false);
const idNumber = ref('');

async function fetchToken(credentials: { username: string; password: string }) {
  const orgId = localStorage.getItem('orgId');
  try {
    if (orgId && !isOpenCom.value) {
      const response = await login(credentials, orgId);
      return response;
    } else if (orgId && isOpenCom.value) {
      if (idNumber.value) {
        const response = await loginCard({ idNumber: idNumber.value }, orgId);
        return response;
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

async function fetchPermissionsAuth() {
  try {
    const response = await personalAuth();
    return response;
  } catch (error) {
    console.error('Error fetching permissionsAuth:', error);
    throw error;
  }
}

async function fetchPermissionsInfo() {
  try {
    const response = await personalInfo();
    return response;
  } catch (error) {
    console.error('Error fetching permissionsInfo:', error);
    throw error;
  }
}

async function loginAndFetchPermissions(credentials: {
  username: string;
  password: string;
}) {
  try {
    const loginResponse = await fetchToken(credentials);
    console.log('loginResponse', loginResponse);

    if (loginResponse?.status === 200) {
      const decodedToken: token = jwtDecode(loginResponse.data.accessToken);
      authStore.updateUserInfo({ ...loginResponse.data });
      authStore.updateUserInfo({ ...decodedToken });
      const permissionsAuthResponse = await fetchPermissionsAuth();
      const permissionsInfoResponse = await fetchPermissionsInfo();
      return {
        loginData: loginResponse,
        permissionsAuth: permissionsAuthResponse,
        permissionsInfo: permissionsInfoResponse,
      };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error in login and fetch process:', error);
    throw error;
  }
}

function setCookie(cName: string, cValue: string, exDays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cName + '=' + cValue + ';' + expires + ';path=/';
}

const onSubmit = async () => {
  isLogin.value = true;
  if (rememberAccount.value) {
    setCookie('CloudHIS-account', account.value, 7); //記住7天
  }
  try {
    const { loginData, permissionsAuth, permissionsInfo } =
      await loginAndFetchPermissions({
        username: account.value,
        password: otp.value,
      });

    const employeeData = {
      organizationId: permissionsInfo.data.employee.organizationId,
      no: permissionsInfo.data.employee.no,
      chName: permissionsInfo.data.employee.chName,
      enName: permissionsInfo.data.employee.enName,
      title: permissionsInfo.data.employee.title,
    };

    const userData = { employee: employeeData };
    authStore.updateUserInfo(userData);

    const permissionsData = {
      permissionsRoles: permissionsAuth.data.roles,
      permissionsAPI: permissionsAuth.data.permissions,
    };

    authStore.updateUserInfo({ ...permissionsData });

    if (
      loginData.status === 200 &&
      permissionsAuth.status == 200 &&
      permissionsInfo.status == 200
    ) {
      showNoticeMessage({
        type: 'positive',
        message: '登入成功',
        content: '',
      });
      handleRoute();
    }
  } catch (error) {
    showNoticeMessage({
      type: 'negative',
      message: '登入失敗,請重新登入',
      content: '',
    });
    console.error('Error in onSubmit:', error);
  }
  isLogin.value = false;
};

function onReset() {
  account.value = '';
  otp.value = '';
  accept.value = false;
}

function getCookie(cName: string) {
  let name = cName + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

onMounted(async () => {
  account.value = getCookie('CloudHIS-account');
  window.history.replaceState(null, '', window.location.href);
});

defineExpose({
  base64Image,
  clinicName,
});
</script>
<style scoped lang="scss">
:deep(.q-btn) {
  border-radius: 8px;
  height: 50px !important;
  font-weight: bold;
}

.container {
  height: 95vh;
  &-login {
    width: 456px;
    padding: 32px 40px 40px 40px;
    border-radius: 24px;

    @media (max-width: $breakpoint-sm-min) {
      padding: 16px 20px 20px 20px;
    }

    img {
      width: 198px;
      height: 72px;
    }

    h1 {
      font-weight: bold !important;
    }
  }

  &-fet {
    position: fixed;
    bottom: 20px;
  }
}
</style>
