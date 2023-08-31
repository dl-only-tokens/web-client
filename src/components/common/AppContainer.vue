<script setup lang="ts">
import AppFooter from './AppFooter.vue'

withDefaults(
  defineProps<{
    isFooterVisible?: boolean
  }>(),
  {
    isFooterVisible: true,
  },
)
</script>

<template>
  <div class="page-container">
    <div class="app-container">
      <slot></slot>
    </div>
    <app-footer :is-visible="isFooterVisible" />
  </div>
</template>

<style scoped lang="scss">
.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-container {
  width: 100%;
  max-width: 696px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;

  display: flex;
  flex-direction: column;
  flex: 1;

  @include respond-to(medium) {
    margin: 0;
    width: 100%;
    max-width: none;
  }

  @include respond-to(mobile) {
    padding: 0 16px;
  }
}
</style>
