<template>
    <GuildLineController  />
  <router-view />
</template>

<script setup lang="ts">
defineOptions({
  name: 'App'
});

import GuildLineController from './pages/GuildLine.vue/GuildLineController.vue';
</script>
