<script setup lang="ts">
import { useProviderStore } from '@/store'

import { AppHeader } from './components/common'

const providerStore = useProviderStore()
providerStore.initDefaultProvider()
</script>

<template>
  <app-header />
  <router-view v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
