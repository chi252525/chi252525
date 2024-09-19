<template>
  <div class="ci-container">
    <div class="ci-img img-blue"></div>
    <div class="ci-img img-yellow"></div>
    <div class="ci-img img-pink"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.ci-container {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  z-index: -1;
  background: $background;
}

.ci-img {
  position: absolute;

  &.img-pink {
    width: 993px;
    height: 442px;
    bottom: 0px;
    right: 0px;
    background-image: url('src/assets/images/ci/ci-pink.svg');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  &.img-yellow {
    width: 319px;
    height: 362px;
    bottom: 7vh;
    right: 11vw;
    z-index: 10;
    background-image: url('src/assets/images/ci/ci-yellow.svg');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  &.img-blue {
    width: 1245px;
    height: 483px;
    top: -21vh;
    left: -40vw;
    background-image: url('src/assets/images/ci/ci-blue.svg');
    background-repeat: no-repeat;
    background-size: 100%;
  }
}
</style>
