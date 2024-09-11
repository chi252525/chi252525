<template>
  <q-layout view="hHh Lpr fFf" class="fullscreen-layout">
    <q-page-container class="fullscreen-container">
      <P5Canvas />
    </q-page-container>
    <q-page-container class="flex flex-center">
      <piano title="piano" active></piano>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Piano from 'components/Piano.vue';
import P5Canvas from 'components/P5Canvas.vue';
defineOptions({
  name: 'IndexPage',
});
</script>
<style scoped>
.fullscreen-layout {
  height: 100vh; /* 确保 q-layout 占满整个视口高度 */
}

.fullscreen-container {
  display: flex;
  flex-direction: column; /* 确保子元素纵向排列 */
  height: 100%; /* 确保 q-page-container 占满父容器 */
}
</style>
