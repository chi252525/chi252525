import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { Loading } from 'quasar';
import { Notify } from 'quasar';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory;

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  history: createHistory(process.env.VUE_ROUTER_BASE),
});

router.beforeEach(async (to, from, next) => {
  const uuid = to.query.uuid;
  // Loading.show();
  const authStore = useAuthStore();
  const token = authStore.user.accessToken;
  const requiredPageId = to.meta.pageId; //該路由需要經過授權

  if (requiredPageId) {
    if (token) {
      await authStore.getPermission();
      const permissionStore = authStore.permissions;
      const hasPermission = permissionStore.some(
        (permission) => permission.code === requiredPageId
      );

      if (!hasPermission) {
        console.log(' !hasPermission:', hasPermission);
        next(`/login?uuid=${authStore.user.orgId}`);
        await authStore.logout();
      }
    } else {
      console.log(' !token:', !token);
      Notify.create({ message: '授權不存在，請重新登入', type: 'negative' });
      return next('/');
    }
  }
  if (token && to.path.startsWith('/login') && uuid) {
    if (uuid === authStore.user.orgId) {
      Notify.create({
        message: '登入狀態中，如需變更登入帳號請先登出。',
        type: 'negative',
        position: 'top',
      });
      return next('/home');
    } else {
      await authStore.logout();
      return next(`/login?uuid=${uuid}`);
    }
  }
  if (!token && to.path.startsWith('/home')) {
    return next('/');
  }
  next();
});

router.afterEach(() => {
  Loading.hide(); // 停止 Loading
});

export default router;
