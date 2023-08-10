<script setup lang="ts">
import { AppHeader } from './components/common'
</script>

<template>
  <app-header />
  <router-view v-slot="{ Component }">
    <transition name="slide">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease-out;
}

@mixin slide-position {
  position: absolute;
  padding-top: 112px;
}

// When new slide coming
.slide-enter-to {
  @include slide-position;
  opacity: 1;
}

.slide-enter-from {
  @include slide-position;
  opacity: 0;
}

// When old slide leaving
.slide-leave-to {
  @include slide-position;
  opacity: 0;
}

.slide-leave-from {
  @include slide-position;
  opacity: 1;
}
</style>
