<script setup lang="ts">
import { ICON_NAMES } from '@/enums'

import AppIcon from '../AppIcon.vue'

defineProps<{
  name: string
  iconName?: ICON_NAMES
}>()
</script>

<template>
  <button>
    <app-icon v-if="iconName" :name="iconName"></app-icon>
    {{ name }}
  </button>
</template>

<style scoped lang="scss">
button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  height: 44px;
  padding: 0 20px;

  background: transparent;
  border-radius: 16px;
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--border-secondary);
  opacity: 1;

  color: var(--text-primary);
  font-family: var(--font-family-inter);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  width: max-content;

  transition: all 0.3s ease;

  &:hover {
    border-color: var(--border-primary);
  }
}
</style>
