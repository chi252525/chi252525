<template>
  <q-layout view="view">
    <q-toolbar class="bg-yellow text-black shadow-2 rounded-borders">
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      <q-btn flat label="Lemon Breeze" />
      <q-space />

      <q-tabs shrink>
        <q-tab name="tab1" label="Music" @click="navigate('music')" />
        <q-tab name="tab2" label="Sea & Tree" @click="navigate('seaAndTree')" />
        <q-tab name="tab3" label="Slice" @click="navigate('Slice')" />
        <q-tab name="tab4" label="Contact" @click="navigate('contact')" />
      </q-tabs>
    </q-toolbar>

    <q-page-container>
      <q-page class="q-pa-md bg-background">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MainLayout',
});

const router = useRouter();

function navigate(routeName: string) {
  // Navigate to the route with the given name
  router.push({ name: routeName });
}
</script>
