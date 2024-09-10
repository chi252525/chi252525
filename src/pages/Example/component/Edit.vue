<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="dialog-content-md">
      <q-card-section>
        <div class="dialog-header">
          <div class="header-title">{{ dialogTitle }}</div>
          <q-space />
          <div>
            <q-btn
              v-close-popup
              outline
              color="primary"
              class="guide-btn btn-leave"
              >離開</q-btn
            >
            <q-btn color="accent" class="guide-btn btn-save" @click="save()"
              >存檔</q-btn
            >
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-input
            ref="inputFreqCode"
            v-model="freqObj.freqCode"
            :rules="rules"
            outlined
            placeholder="請輸入頻率代碼"
            label="頻率代碼"
            class="col-sm-12 q-mr-md col-md-3 is_require"
            :class="{
              'q-mb-none': $q.screen.gt.sm,
              'q-mb-md': $q.screen.sm || $q.screen.xs,
            }"
            hide-bottom-space
          />
          <q-input
            v-model="freqObj.freqShortName"
            outlined
            placeholder="請輸入頻率簡碼"
            label="頻率簡碼"
            class="col-sm-12 q-mr-md col-md-4 q-mb-md"
            :class="{
              'q-mb-none': $q.screen.gt.sm,
              'q-mb-md': $q.screen.sm || $q.screen.xs,
            }"
            hide-bottom-space
          />
          <q-select
            v-model="freqObj.freqInsuCode"
            label="健保申報碼"
            outlined
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            new-value-mode="add"
            hide-bottom-space
            class="col-sm-12 col-md-4"
            :class="{
              'q-mb-none': $q.screen.gt.sm,
              'q-mb-md': $q.screen.sm || $q.screen.xs,
            }"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="row">
          <q-input
            ref="inputFreqCname"
            v-model="freqObj.freqCname"
            :rules="rules"
            outlined
            placeholder="請輸入頻率名稱(中)"
            label="頻率名稱(中)"
            class="col-sm-12 q-mr-md col-md-4 q-mb-md is_require"
            hide-bottom-space
          />
          <q-input
            v-model="freqObj.freqEname"
            outlined
            placeholder="請輸入頻率名稱(英）"
            label="頻率名稱(英）"
            class="col-sm-12 q-mr-md col-md-4 q-mb-md"
            hide-bottom-space
          />
          <q-input
            ref="inputFreqTimes"
            v-model.number="freqObj.freqTimes"
            :rules="rules"
            outlined
            type="number"
            min="0"
            placeholder="請輸入週期內次數"
            label="週期內次數"
            class="col-sm-12 q-mr-md col-md-3 is_require"
            :class="{
              'q-mb-none': $q.screen.gt.sm,
              'q-mb-md': $q.screen.sm || $q.screen.xs,
            }"
            hide-bottom-space
          />
        </div>
        <div class="row items-center">
          <q-input
            ref="inputFreqCycleNum"
            v-model.number="freqObj.freqCycleNum"
            :rules="rules"
            outlined
            type="number"
            min="0"
            placeholder="請輸入循環週期數"
            label="循環週期數"
            class="col-sm-2 q-mr-md col-md-2 is_require"
            hide-bottom-space
          />
          <div
            class="row items-center col-sm-7 q-mr-md col-md-5 border"
            :class="{ 'error-border': !cycleTypeStatus }"
          >
            <div class="checkbox-title">
              <span class="required">*</span>循環週期別
            </div>
            <q-option-group
              v-model="freqObj.freqCycleType"
              :options="cycleTypeList"
              type="radio"
              color="black"
              class="checkbox"
              inline
            />
          </div>
          <q-input
            v-model.number="freqObj.sortValue"
            outlined
            type="number"
            min="0"
            placeholder="請輸入排序"
            label="排序"
            class="col-sm-2 q-mr-md col-md-2"
            hide-bottom-space
          />
        </div>
        <div
          class="row items-centers q-gutter-md"
          :class="{
            'q-mt-none': $q.screen.gt.sm,
            'q-mt-md': $q.screen.sm || $q.screen.xs,
          }"
        >
          <div class="col-sm-5 col-md-2">
            <div class="textSize-14">
              <span class="required"> *</span>是否停用
            </div>
            <q-toggle
              v-model="freqObj.stop"
              :label="
                freqObj.stop === null ? '未填寫' : freqObj.stop ? '是' : '否'
              "
              color="primary"
              class="textSize-16"
              :class="{ 'error-border': !stopStatus }"
            />
          </div>
          <Datepicker
            v-model="freqObj.stopDateTime"
            format="dateTime"
            label="停用日期"
            class="col-sm-5 col-md-2 self-center"
          />
          <div class="col-sm-5 col-md-2">
            <div class="textSize-12">修改日期</div>
            <div class="textSize-16">{{ freqObj.modifiedAt }}</div>
          </div>
          <div class="col-sm-5 col-md-2 column items-start q-px-md">
            <div class="textSize-12">修改人員</div>
            <div v-if="freqObj.modifiedBy" class="textSize-16">
              {{ freqObj.modifiedBy.name }}
            </div>
            <div v-else-if="freqObj.createdBy">
              {{ freqObj.createdBy.name }}
            </div>
            <div v-else></div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import Datepicker from 'src/components/Datepicker/Datepicker.vue';
import type { ITableRowType, MyEventBus } from '../type';
import {
  drugFreqCreate,
  drugFreqUpdate,
} from 'src/api/freqDataMaintenance/services';
import { useDialog } from 'src/composable/AlertDialog';
const bus = inject<MyEventBus>('bus');
const { showNoticeMessage, confirmMessage } = useDialog();

const { dialogRef, onDialogOK } = useDialogPluginComponent();
const props = defineProps<{
  editObj?: ITableRowType;
}>();

const defaultTableRow = {
  id: null,
  organizationId: '10000000-0000-0000-0000-000000000001',
  freqCode: '',
  freqCname: '',
  freqShortName: '',
  freqEname: '',
  freqCycleNum: 1,
  freqInsuCode: '',
  freqTimes: 1,
  freqCycleType: 'D',
  sortValue: 0,
  stop: false,
  stopDateTime: null,
  modifiedBy: null,
  modifiedAt: '',
  createdAt: '',
  createdBy: null,
  giveDrugType: 'F',
};

const freqObj = ref<ITableRowType>({ ...defaultTableRow });
const dialogTitle = computed(() => {
  return props.editObj ? '頻率資料編輯' : '頻率資料新增';
});

const cycleTypeList = ref([
  { value: 'D', label: '每天' },
  { value: 'H', label: '小時' },
  { value: 'N', label: '不循環' },
]);

const toggleValidation = () => {
  if (freqObj.value.stop === true || freqObj.value.stop === false) {
    return true;
  }
  return false;
};

const radioValidation = () => {
  if (typeof freqObj.value.freqCycleType === 'string') {
    return true;
  }
  return false;
};

const rules = [(val: string | null) => val !== '' && val !== null];
const inputFreqCode = ref<null | { validate: () => boolean }>(null);
const inputFreqCname = ref<null | { validate: () => boolean }>(null);
const inputFreqTimes = ref<null | { validate: () => boolean }>(null);
const inputFreqCycleNum = ref<null | { validate: () => boolean }>(null);
const cycleTypeStatus = ref<boolean | null>(true);
const stopStatus = ref<boolean | null>(true);

async function validateNewField() {
  const code = inputFreqCode.value?.validate();
  const name = inputFreqCname.value?.validate();
  const time = inputFreqTimes.value?.validate();
  const cycleNum = inputFreqCycleNum.value?.validate();
  stopStatus.value = toggleValidation();
  cycleTypeStatus.value = radioValidation();
  console.log(cycleTypeStatus.value);
  let fieldValidations: Array<{ field: string; result: boolean | null }> = [
    { field: '頻率代碼', result: !code },
    { field: '頻率名稱(中)', result: !name },
    { field: '週期內次數', result: !time },
    { field: '循環週期數', result: !cycleNum },
    { field: '循環週期別', result: !cycleTypeStatus.value },
    { field: '是否啟用', result: !stopStatus.value },
  ];
  const invalidKeys = fieldValidations
    .filter(({ result }) => result)
    .map(({ field }) => field);
  const errorFields = invalidKeys.join('、');
  const describe = errorFields.length > 0 ? '欄位必填' : '';

  if (errorFields.length === 0) {
    return true;
  } else {
    await confirmMessage({
      type: 'negative',
      deleteConfirmStatus: true,
      message: `${describe}`,
      content: `${errorFields}`,
    });
    console.log('檢核錯誤');
  }
}

async function save() {
  const isValid = await validateNewField();
  if (isValid) {
    if (props.editObj) {
      //編輯
      try {
        const response = await drugFreqUpdate(
          freqObj.value.id as string,
          freqObj.value
        );
        const responseStatus = response.status;
        if (responseStatus >= 200 && responseStatus < 300) {
          await showNoticeMessage({
            type: 'black',
            message: '修改頻率資料成功',
            content: '',
          });
          if (bus) {
            bus.emit('get-table-parameter', null);
          }
          onDialogOK();
        }
      } catch (error) {
        showNoticeMessage({
          type: 'negative',
          message: '修改頻率資料失敗',
          content: '',
        });
        console.log(error);
      }
    } else {
      //新增
      try {
        const response = await drugFreqCreate(freqObj.value);
        const responseStatus = response.status;
        if (responseStatus >= 200 && responseStatus < 300) {
          showNoticeMessage({
            type: 'black',
            message: '新增頻率資料成功',
            content: '',
          });
          if (bus) {
            bus.emit('get-table-parameter', null);
          }
          onDialogOK();
        }
      } catch (error) {
        showNoticeMessage({
          type: 'negative',
          message: '新增頻率資料失敗',
          content: '',
        });
        console.log(error);
      }
    }
  }
}

const updateFreqObj = async () => {
  if (props.editObj) {
    freqObj.value = { ...props.editObj };
  }
};

onMounted(async () => {
  await updateFreqObj();
});

watch(
  () => props.editObj,
  () => {
    updateFreqObj();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.dialog-content {
  > .row {
    margin: 0 -8px;
  }
  .col {
    padding: 0px 8px;
    margin-bottom: 16px;
  }
}

.checkbox {
  font-weight: bold;
}

.required {
  color: red !important;
  font-size: large;
  font-weight: bold !important;
}
.border {
  padding: 4px;
  border: 1px solid #c2c2c2;
  border-radius: 10px;
}

.error-border {
  padding: 4px;
  border: 2px solid #fc7b66;
  border-radius: 10px;
}
</style>
