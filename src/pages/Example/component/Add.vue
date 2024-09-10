<template>
  <q-card flat class="area-top">
    <div class="row justify-around">
      <div class="row justify-start items-start">
        <q-btn
          no-caps
          class="guide-btn darken-hover textSize-16 q-px-lg add-btn"
          color="accent"
          label="新增"
          size="md"
          :class="{
            'q-mb-none': $q.screen.gt.sm,
            'q-mb-md': $q.screen.sm || $q.screen.xs,
          }"
          @click="createTableRowItem()"
        />
      </div>
      <div class="row col-sm-8 col-md-5 col-lg-6 col-xl-6 justify-start">
        <div class="header-title-row row items-center">
          <q-icon class="header-icon" name="search" />搜尋條件
        </div>
        <q-input
          v-model="searchObj.freqCode"
          dense
          outlined
          clearable
          label="頻率代碼"
          hide-bottom-space
          class="row col-sm-12 q-mr-md col-md-4 col-lg-3 col-xl-3"
          :class="{
            'q-mb-none': $q.screen.gt.sm,
            'q-mb-md': $q.screen.sm || $q.screen.xs,
          }"
        />
        <q-input
          v-model="searchObj.freqCname"
          dense
          outlined
          clearable
          label="頻率名稱(中)"
          hide-bottom-space
          class="row col-sm-12 col-md-4 col-lg-3 col-xl-3 q-mr-lg"
          :class="{
            'q-mb-none': $q.screen.gt.sm,
            'q-mb-md': $q.screen.sm || $q.screen.xs,
          }"
        />
      </div>

      <div
        class="col-sm-12 q-mr-sm col-md-5 col-lg-4 col-xl-4 justify-end items-center"
      >
        <q-btn
          class="guide-btn darken-hover textSize-16 q-mr-sm"
          size="md"
          outline
          color="primary"
          label="清空查詢"
          @click="reset()"
        />
        <q-btn
          :loading="loadingStates"
          class="guide-btn darken-hover textSize-16 q-px-lg col-md-5 col-lg-4 col-xl-4 q-mr-sm"
          color="primary"
          size="md"
          @click="searchResult()"
          >查詢<template v-slot:loading>
            <div class="spinner-container">
              <q-spinner class="on-left" />
              Loading...
            </div>
          </template>
        </q-btn>

        <q-btn
          class="guide-btn darken-hover textSize-16 q-mr-sm"
          size="md"
          outline
          color="primary"
          label="匯入常用頻率"
          @click="handleImport()"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type {
  EventPayload,
  IAddFreqDataMaintenanceRequest,
  MyEventBus,
} from '../type';
import { drugFreqList, importSysDrugFreq } from 'src/api/freqDataMaintenance';
const { confirmMessage, showNoticeMessage } = useDialog();
import { useDialog } from 'src/composable/AlertDialog';

const props = defineProps<{
  initialPagination: EventPayload;
}>();

const searchObj = ref<IAddFreqDataMaintenanceRequest>({
  freqCode: '',
  freqCname: '',
  page: props.initialPagination.page,
  rowsPerPage: props.initialPagination.rowsPerPage,
  sortBy: 'freqCode',
  descending: false,
});

const $emit = defineEmits(['createTableRowItem', 'searchResult', 'reset']);
const createTableRowItem = () => {
  $emit('createTableRowItem');
};

const loadingStates = ref(false);

async function searchResult(
  page = searchObj.value.page,
  rowsPerPage = searchObj.value.rowsPerPage,
  sortBy = searchObj.value.sortBy,
  descending = searchObj.value.descending
) {
  loadingStates.value = true;
  if (bus) {
    bus.emit('get-table-status', true);
  }
  const queryParams = new URLSearchParams();
  searchObj.value.page = page;
  searchObj.value.rowsPerPage = rowsPerPage;
  searchObj.value.sortBy = sortBy;
  searchObj.value.descending = descending;
  const coverSortValue = descending ? 'DESC' : 'ASC';
  if (searchObj.value.freqCode) {
    queryParams.append('freqCode', searchObj.value.freqCode);
  }
  if (searchObj.value.freqCname) {
    queryParams.append('freqCname', searchObj.value.freqCname);
  }
  queryParams.append('page', (page - 1).toString());
  queryParams.append('size', rowsPerPage.toString());
  queryParams.append('sort', 'stop'.toString());
  queryParams.append('sort', sortBy + `,${coverSortValue}`);
  try {
    const { data } = await drugFreqList(queryParams.toString());
    $emit('searchResult', data, searchObj.value);
  } catch (error) {}
  loadingStates.value = false;
  if (bus) {
    bus.emit('get-table-status', false);
  }
}

function reset() {
  searchObj.value.freqCode = '';
  searchObj.value.freqCname = '';
  $emit('reset');
}

const bus = inject<MyEventBus>('bus');

const handleEvent = async (obj: EventPayload) => {
  if (obj) {
    const { page, rowsPerPage, sortBy, descending } = obj;
    await searchResult(page, rowsPerPage, sortBy, descending);
  } else {
    await searchResult();
  }
};

onMounted(() => {
  if (bus) {
    bus.on('get-table-parameter', handleEvent);
  }
});

onBeforeUnmount(() => {
  if (bus) {
    bus.off('get-table-parameter', handleEvent);
  }
});

const handleImport = async () => {
  const isConfirm = await confirmMessage({
    type: 'negative',
    deleteConfirmStatus: true,
    message: '即將匯入系統推薦之常用用藥頻率，是否確定？',
    content: '',
  });
  console.log('isConfirm' + isConfirm);
  if (isConfirm) {
    try {
      const response = await importSysDrugFreq();
      if (response.status === 200) {
        showNoticeMessage({
          type: 'black',
          message: '匯入成功',
          content: '',
        });
      } else {
        showNoticeMessage({
          type: 'black',
          message: '匯入失敗',
          content: `錯誤代碼: ${response.status}`,
        });
      }
    } catch (error) {
      showNoticeMessage({
        type: 'black',
        message: '匯入失敗',
        content: '',
      });
    }
  }
};
</script>

<style scoped lang="scss">
.header-title-row {
  margin-right: 15px;
  color: #77ccd8;
  font-size: 0.875rem;
  font-weight: 700;
}
.checkbox {
  font-weight: bold;
}

.add-btn {
  margin-right: 48px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 2px;
    height: 100%;
    background-color: $border;
    position: absolute;
    left: 100%;
    margin-left: 44px;
    top: 0;

    @include pad {
      display: none;
    }
  }
}
</style>
