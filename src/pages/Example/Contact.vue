<template>
  <div class="layout-vert">
    <Add
      :initialPagination="initialPagination"
      @createTableRowItem="createTableRowItem"
      @searchResult="searchResult"
      @reset="reset"
    />

    <Table
      class="table"
      :rows="tableRows"
      :initialPagination="initialPagination"
      @editTableRowItem="editTableRowItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import Add from './component/Add.vue';
import Edit from './component/Edit.vue';
import Table from './component/Table.vue';
import type { EventPayload, IDrugFreqList, ITableRowType } from './type';

const tableRows = ref<ITableRowType[]>([]);
const initialPagination = ref({
  sortBy: 'freqCode',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});
const $q = useQuasar();
const editTableRowItem = (editObj: ITableRowType) => {
  $q.dialog({
    component: Edit,
    componentProps: { editObj },
  })
    .onOk(async () => {
      console.log('On OK');
    })
    .onCancel(() => {
      console.log('On Cancel');
    });
};

const createTableRowItem = () => {
  $q.dialog({
    component: Edit,
  })
    .onOk(() => {
      console.log('On OK');
    })
    .onCancel(() => {
      console.log('On Cancel');
    });
};

const searchResult = (objArray: IDrugFreqList, parameter: EventPayload) => {
  tableRows.value = objArray.content.map((item) => ({ ...item }));
  initialPagination.value.rowsNumber = objArray.total_elements;
  initialPagination.value.page = parameter.page;
  initialPagination.value.rowsPerPage = parameter.rowsPerPage;
  initialPagination.value.sortBy = parameter.sortBy;
  initialPagination.value.descending = parameter.descending;
};
const reset = () => {
  tableRows.value = JSON.parse(JSON.stringify([]));
};
</script>

<style scoped lang="scss"></style>
