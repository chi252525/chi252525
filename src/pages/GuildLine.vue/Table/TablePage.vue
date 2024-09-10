<template>
  <q-toolbar class="bg-primary text-white q-mt-lg">
    <q-toolbar-title> Table </q-toolbar-title>
  </q-toolbar>
  <q-separator />
  <div class="q-pt-md">
    <div class="q-ma-lg">
      <div class="q-pa-md">
        <div class="q-gutter-y-md">
          <div class="q-mt-sm text-h6">1. 新增 class guide-table</div>
        </div>
      </div>
    </div>

    <q-table
      v-model:pagination="initialPagination"
      :rows="rowData"
      :columns="columnData"
      row-key="index"
      class="guide-table"
      style="height: 500px"
      :loading="loading"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name == 'edit'">
              <q-btn
                size="md"
                dense
                class="guide-btn darken-hover"
                color="primary"
                outline
                icon="edit"
              />
            </template>
            <template v-else-if="col.name == 'copy'">
              <q-btn
                size="md"
                dense
                class="guide-btn darken-hover"
                outline
                color="grey"
                icon="file_copy"
              ></q-btn>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" size="42px" />
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

//表格載入中
const loading = ref(false);

//分頁資訊
const initialPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

interface RowData {
  EndDate: string;
  StartDate: string;
  Status: string;
  // 根據需要添加其他字段
}
// Define the type of the function that gets a value from a row
type FieldFunction = (row: RowData) => string | number | boolean; // Adjust the return type as needed

type Column = {
  name: string;
  label: string;
  field: keyof RowData | FieldFunction;
  required?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sort?: (a: RowData, b: RowData, rowA: RowData, rowB: RowData) => number;
  headerClasses?: string;
};
let columnData = ref<Column[]>([
  {
    name: 'EndDate',
    label: '生效迄日',
    field: 'EndDate', // Directly using the key of RowData
    required: true,
    align: 'left',
    sortable: true,
    sort: (a: RowData, b: RowData) => {
      // Sort function with explicit types
      if (a.EndDate < b.EndDate) return -1;
      if (a.EndDate > b.EndDate) return 1;
      return 0;
    },
    headerClasses: '',
  },
  {
    name: 'Status',
    label: '狀態',
    field: (row: RowData) => row.Status, // Using the RowData type for the row parameter
    align: 'center',
    sortable: false,
    headerClasses: 'status-class',
  },
]);
const rowData = ref<RowData[]>([
  {
    EndDate: '090.12.31',
    StartDate: '087.07.01',
    Status: 'Active',
    // Include other fields as needed
  },
]);
</script>
<style scoped lang="scss"></style>
