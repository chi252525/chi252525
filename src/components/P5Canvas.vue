<template>
  <div ref="p5Container" class="p5-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import p5 from 'p5';

export default defineComponent({
  name: 'P5Canvas',
  setup() {
    const p5Container = ref<HTMLDivElement | null>(null);
    let p5Instance: p5 | null = null;

    const sketch = (p: p5) => {
      p.setup = () => {
        if (p5Container.value) {
          p.createCanvas(
            p5Container.value.clientWidth,
            p5Container.value.clientHeight
          );
        }
        p.background(255);
      };

      p.draw = () => {
        p.fill(255, 0, 0);
        p.ellipse(p.mouseX, p.mouseY, 50, 50);
      };
    };

    onMounted(() => {
      if (p5Container.value) {
        p5Instance = new p5(sketch, p5Container.value);
      }
    });

    onBeforeUnmount(() => {
      if (p5Instance) {
        p5Instance.remove();
      }
    });

    return {
      p5Container,
    };
  },
});
</script>

<style scoped>
.p5-container {
  width: 100%;
  height: 100%;
}
</style>
