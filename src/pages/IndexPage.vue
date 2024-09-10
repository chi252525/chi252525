<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container class="flex flex-center">
      <piano title="piano" active></piano>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Piano from 'components/Piano.vue';

defineOptions({
  name: 'IndexPage',
});
</script>
