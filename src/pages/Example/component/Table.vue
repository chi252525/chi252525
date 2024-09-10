<template>
  <q-table
    v-model:pagination="pagination"
    :rows-per-page-options="[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]"
    :rows="rowData"
    :columns="columns"
    :loading="loadingStates"
    flat
    row-key="id"
    binary-state-sort
    bordered
    class="guide-table"
    @request="onRequest"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name == 'edit'">
            <q-btn
              size="md"
              dense
              class="guide-btn darken-hover outlined"
              color="primary"
              outline
              icon="edit"
              :disable="isDisabled(props.row)"
              @click="editTableRowItem(props.row)"
            />
          </template>
          <template v-else-if="col.name == 'delete'">
            <q-btn
              v-show="!props.row.stop"
              size="md"
              dense
              class="guide-btn darken-hover"
              outline
              color="accent"
              icon="delete"
              @click="disablesTableRowItem(props.row)"
            />
            <q-btn
              v-show="props.row.stop"
              size="md"
              dense
              class="guide-btn darken-hover outlined"
              color="primary"
              icon="restore"
              @click="reStoreItem(props.row)"
            />
          </template>
          <template v-if="col.name == 'freqCycleType'">
            {{ getFreqCycleType(col.value) }}
          </template>
          <template v-else-if="col.name == 'stopDateTime'">
            <Datepicker
              :key="componentKey"
              v-model="props.row.stopDateTime"
              :readonly="true"
              format="dateTime"
              style="width: 150px"
            />
          </template>
          <template v-else>{{ col.value }}</template>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" size="42px" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { QTableProps } from 'quasar';
import type { EventPayload, ITableRowType, MyEventBus } from '../type';
import { useDialog } from 'src/composable/AlertDialog';
import { drugFreqUpdate } from 'src/api/freqDataMaintenance/services';
import { formatDate } from 'src/utils/date';
import Datepicker from 'src/components/Datepicker/Datepicker.vue';
const props = defineProps<{
  rows: ITableRowType[];
  initialPagination: EventPayload;
}>();

const bus = inject<MyEventBus>('bus');
const columns = ref<QTableProps['columns']>([
  { name: 'edit', align: 'left', field: 'edit', label: '編輯' },
  { name: 'delete', align: 'left', field: 'delete', label: '刪除' },
  {
    name: 'freqCode',
    align: 'left',
    label: '頻率代碼',
    field: 'freqCode',
    sortable: true,
  },
  {
    name: 'freqCname',
    align: 'left',
    label: '頻率名稱(中)',
    field: 'freqCname',
    sortable: true,
  },
  {
    name: 'freqEname',
    align: 'left',
    label: '頻率名稱(英)',
    field: 'freqEname',
  },
  {
    name: 'freqShortName',
    align: 'left',
    label: '頻率簡碼',
    field: 'freqShortName',
  },
  {
    name: 'freqInsuCode',
    align: 'left',
    label: '健保申報碼',
    field: 'freqInsuCode',
  },
  { name: 'freqTimes', align: 'left', label: '週期內次數', field: 'freqTimes' },
  {
    name: 'freqCycleType',
    align: 'left',
    label: '循環週期類',
    field: 'freqCycleType',
    sortable: true,
  },
  {
    name: 'freqCycleNum',
    align: 'left',
    label: '循環週期數',
    field: 'freqCycleNum',
  },
  { name: 'sortValue', align: 'left', label: '排序', field: 'sortValue' },
  {
    name: 'stopDateTime',
    align: 'left',
    label: '停用日期',
    field: 'stopDateTime',
  },
  {
    name: 'defaultValue',
    align: 'left',
    label: '是否預設',
    field: 'defaultValue',
    format: (val: boolean | undefined) => getChineseYesNo(val),
  },
]);
const loadingStates = ref(false);
const pagination = ref({ ...props.initialPagination });
const rowData = ref<ITableRowType[]>([]);
const cycleTypeList = [
  { value: 'D', label: '每天' },
  { value: 'H', label: '小時' },
  { value: 'N', label: '不循環' },
];
const getChineseYesNo = (isYes: boolean | undefined) => {
  if (isYes === undefined) return '';
  return isYes ? '是' : '否';
};
const getFreqCycleType = (val: string) => {
  return cycleTypeList.find((obj) => obj.value == val)?.label || val;
};

const $emit = defineEmits(['editTableRowItem']);
const editTableRowItem = (item: ITableRowType) => {
  $emit('editTableRowItem', item);
};

const { confirmMessage, showNoticeMessage } = useDialog();
const componentKey = ref(0);
const disablesTableRowItem = async (item: ITableRowType) => {
  const isConfirm = await confirmMessage({
    type: 'negative',
    deleteConfirmStatus: true,
    message: `確定要停用 ${item.freqCode} ?`,
    content: '',
  });
  if (isConfirm) {
    componentKey.value += 1;
    try {
      const requestData = {
        ...item,
        stop: true,
        stopDateTime: formatDate(new Date()),
      };
      const response = await drugFreqUpdate(item.id as string, requestData);
      const responseStatus = response.status;
      if (responseStatus >= 200 && responseStatus < 300) {
        showNoticeMessage({
          type: 'black',
          message: `頻率代碼『${item.freqCode}』已停用`,
          content: '',
        });
      }
    } catch (error) {
      console.log(error);
    }
    if (bus) {
      bus.emit('get-table-parameter', null);
    }
  }
};

const reStoreItem = async (item: ITableRowType) => {
  const isConfirm = await confirmMessage({
    type: 'positive',
    deleteConfirmStatus: true,
    message: `確定要啟用頻率代碼『${item.freqCode}』?`,
    content: '',
  });
  if (isConfirm) {
    componentKey.value += 1;
    try {
      const requestData = { ...item, stop: false, stopDateTime: null };
      const response = await drugFreqUpdate(item.id as string, requestData);
      const responseStatus = response.status;
      if (responseStatus >= 200 && responseStatus < 300) {
        showNoticeMessage({
          type: 'black',
          message: `頻率代碼『${item.freqCode}』已啟用`,
          content: '',
        });
      }
    } catch (error) {
      console.log(error);
    }
    if (bus) {
      bus.emit('get-table-parameter', null);
    }
  }
};

const isDisabled = (row: ITableRowType) => {
  if (row.stopDateTime && typeof row.stopDateTime === 'string') {
    const stopDateTime = new Date(row.stopDateTime.replace(/-/g, '/'));
    const today = new Date();
    if (stopDateTime < today) {
      row.stop = true;
    }
    return stopDateTime < today;
  }
  return row.stop ? true : false;
};

const onRequest = (props: {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy: string;
    descending: boolean;
  };
}) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  if (bus) {
    bus.emit('get-table-parameter', { page, rowsPerPage, sortBy, descending });
  }
};

watch(
  () => props.rows,
  (newData) => {
    rowData.value = newData;
    componentKey.value--;
  },
  { immediate: true, deep: true }
);

watch(
  () => props.initialPagination,
  (newData) => {
    pagination.value = newData;
  },
  { immediate: true, deep: true }
);

const handleEvent = async (status: boolean) => {
  loadingStates.value = status;
};

onMounted(() => {
  if (bus) {
    bus.on('get-table-status', handleEvent);
  }
});

onBeforeUnmount(() => {
  if (bus) {
    bus.off('get-table-status', handleEvent);
  }
});
</script>

<style scoped lang="scss">
:deep(.q-table) {
  thead {
    background-color: #f5f7fa;

    th {
      color: $placeholder;
    }
  }
}

.table {
  height: 100%;
}

.editStatus {
  background: #fdf5e6;
}
</style>
