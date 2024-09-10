<template>
  <q-carousel v-model="currentSlide" animated arrows navigation infinite>
    <q-carousel-slide
      v-for="slide in slides"
      :key="slide.name"
      :name="slide.name"
      :img-src="slide.imgSrc"
    />
  </q-carousel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Initialize the current slide state
const currentSlide = ref(0); // Default to the first slide

// Example slides data
const slides = [
  { name: '1', imgSrc: 'https://via.placeholder.com/800x400?text=Slide+1' },
  { name: '2', imgSrc: 'https://via.placeholder.com/800x400?text=Slide+2' },
  { name: '3', imgSrc: 'https://via.placeholder.com/800x400?text=Slide+3' },
];
</script>
