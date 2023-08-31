<script setup lang="ts">
import { useProviderStore } from '@/store'

import { AppHeader } from './components/common'

const providerStore = useProviderStore()
providerStore.initDefaultProvider()
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
$transition-duration: 0.25s;

.slide-enter-active,
.slide-leave-active {
  transition: all $transition-duration ease-out;
}

// Delay between page changed
.slide-enter-active {
  transition-delay: $transition-duration;
  height: 100vh;
  overflow: hidden;
}

@mixin slide-position {
  position: absolute;
  padding-top: 112px;

  @include respond-to(mobile) {
    padding-top: 88px;
  }
}

// When new slide coming, enter-from -> enter-to
.slide-enter-from {
  @include slide-position;
  opacity: 0;
}

.slide-enter-to {
  @include slide-position;
  opacity: 1;
}

// When old slide leaving, leave-from -> leave-to
.slide-leave-from {
  @include slide-position;
  opacity: 1;
}

.slide-leave-to {
  @include slide-position;
  opacity: 0;
}
</style>
