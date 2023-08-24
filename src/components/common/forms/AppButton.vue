<script setup lang="ts">
import AppLoader from '../AppLoader.vue'
import AppButtonContainer from './AppButtonContainer.vue'

defineProps<{
  name: string
  disabled?: boolean
  loaded?: boolean
}>()
</script>

<template>
  <app-button-container :disabled="disabled" :loaded="loaded">
    <transition name="fade">
      <span v-if="!loaded">{{ name }}</span>
    </transition>
    <transition name="fade-loader">
      <app-loader v-if="loaded" class="loader" type="dark" />
    </transition>
  </app-button-container>
</template>

<style scoped lang="scss">
button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  height: 44px;
  padding: 0 20px;

  span {
    font-family: var(--font-family-inter);
    color: var(--text-text-invert);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  &:disabled {
    color: var(--disable-secondary);
  }

  .loader {
    height: 24px;
    position: absolute;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-loader-enter-active,
.fade-loader-leave-active {
  transition-delay: 0.2s;
}

.fade-loader-enter-from,
.fade-loader-leave-to {
  opacity: 0;
}
</style>
