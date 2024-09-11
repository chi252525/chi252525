<template>
  <div class="piano">
    <div
      v-for="(key, index) in keys"
      :key="index"
      class="key"
      :class="{ 'black-key': key.isBlack }"
      :style="getKeyStyle(index)"
      @mousedown="playSound(key.note)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import * as Tone from 'tone';

// Define types for key
interface Key {
  note: string;
  label: string;
  isBlack: boolean;
}

// Define the keys of the piano
const keys: Key[] = [
  { note: 'C4', label: 'C', isBlack: false },
  { note: 'C#4', label: 'C#', isBlack: true },
  { note: 'D4', label: 'D', isBlack: false },
  { note: 'D#4', label: 'D#', isBlack: true },
  { note: 'E4', label: 'E', isBlack: false },
  { note: 'F4', label: 'F', isBlack: false },
  { note: 'F#4', label: 'F#', isBlack: true },
  { note: 'G4', label: 'G', isBlack: false },
  { note: 'G#4', label: 'G#', isBlack: true },
  { note: 'A4', label: 'A', isBlack: false },
  { note: 'A#4', label: 'A#', isBlack: true },
  { note: 'B4', label: 'B', isBlack: false },
];

// Create a function to play sound
function playSound(note: string) {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note, '8n');
}

// Function to get inline style for black keys
function getKeyStyle(index: number) {
  const isBlack = keys[index].isBlack;
  if (isBlack) {
    // Black key offset based on its position
    var blackKeyOffset = 0 - index * 38; // Adjust this value to set spacing
    var whiteKeyWidth = 20; // Width of white keys
    var offset = whiteKeyWidth / 2 - blackKeyOffset / 2;
    if (index >= 6) {
      blackKeyOffset += -40;
      offset = whiteKeyWidth / 2 - blackKeyOffset / 2;
    }
    return {
      left: `${offset}px`, // Adjust alignment of black keys
    };
  }
  return {};
}
</script>

<style scoped>
.piano {
  display: flex;
  align-items: flex-end;
  position: relative; /* Needed for absolute positioning of black keys */
}

.key {
  width: 40px;
  height: 150px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  position: relative; /* Positioning context for black keys */
}

.black-key {
  width: 30px;
  height: 100px;
  background: black;
  position: absolute;
  top: 0; /* Align with the top of white key */
  z-index: 1; /* Ensure black key is on top */
}
</style>
