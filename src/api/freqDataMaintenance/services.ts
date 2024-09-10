import { api } from 'src/boot/axios'; // Assuming 'axios' is exported from 'boot/axios'//+
import { IDrugFreqListResponse, IFreqData } from './type';
import { useAuthStore } from 'src/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const orgId = computed(() => authStore.user.orgId);

export const importSysDrugFreq = () => {
  return api.get('/drug-frequency/sync', {
    headers: {
      orgId: orgId.value,
    },
  });
};

export const drugFreqList = (params: string) => {
  return api.get<IDrugFreqListResponse>(
    `/orgs/${orgId.value}/drug-frequency?${params}`
  );
};

export const drugFreqCreate = (params: object) => {
  return api.post<IFreqData>(`/orgs/${orgId.value}/drug-frequency`, params);
};

export const drugFreqUpdate = (id: string, params: object) => {
  return api.put<IFreqData>(
    `/orgs/${orgId.value}/drug-frequency/${id}`,
    params
  );
};
