<script setup lang="ts">
import AppLoader from './AppLoader.vue'

const props = defineProps<{
  isHide?: boolean
}>()
</script>

<template>
  <div :class="{ 'page-loader': true, hide: props.isHide }">
    <app-loader class="page-loader__preloader" />
    <div class="page-loader__text">
      <span>Wait a minute</span>
      <span>Page is in the process of loading</span>
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

  &.hide {
    opacity: 0;
  }

  .page-loader__preloader {
    width: 72px;
    height: 72px;
  }

  .page-loader__text {
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
      color: var(--text-primary);
      text-align: center;
      font-family: var(--font-family-nunito);
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
    }

    span:last-child {
      color: var(--text-secondary);
      font-family: var(--font-family-inter);
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
  }
}
</style>
