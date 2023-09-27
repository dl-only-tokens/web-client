<script setup lang="ts">
import { ICON_NAME } from '@/enums'

import AppIcon from '../AppIcon.vue'

defineProps<{
  title?: string
}>()
</script>

<template>
  <div v-if="title" class="app-modal-header">
    <h3 class="app-modal-header__title">{{ title }}</h3>
    <app-icon :name="ICON_NAME.close" />
  </div>
</template>

<style lang="scss" scoped>
.app-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 92px;
  border-bottom: 1px solid var(--border-tertiary);
  padding: 0 32px;

  @include respond-to(mobile) {
    height: 76px;
    padding: 0 16px;
  }

  &__title {
    font-weight: 600;
  }

  .app-icon {
    cursor: pointer;
  }
}
</style>
