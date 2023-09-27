<script setup lang="ts">
import AppLoader from './AppLoader.vue'

const props = defineProps<{
  isHidden?: boolean
}>()
</script>

<template>
  <div :class="{ 'page-loader': true, 'page-loader_hidden': props.isHidden }">
    <app-loader class="page-loader__preloader" />
    <div class="page-loader__info">
      <span class="page-loader__info__title">Wait a minute</span>
      <span class="page-loader__info__subtitle">Page is in the process of loading</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-loader {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  background: var(--bg-primary);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  height: calc(100% - 136px);
  transition: all 0.2s ease-in;
  z-index: 1;

  &_hidden {
    opacity: 0;
  }

  &__preloader {
    width: 72px;
    height: 72px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
      color: var(--text-primary);
      text-align: center;
      font-family: var(--font-family-secondary);
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
    }

    &__subtitle {
      color: var(--text-secondary);
      font-family: var(--font-family-primary);
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
  }
}
</style>
