<script setup lang="ts">
import { ICON_NAMES } from '@/enums'

import AppIcon from '../AppIcon.vue'

defineProps<{
  title?: string
}>()

const emit = defineEmits(['update:is-shown'])

const closeModal = () => {
  emit('update:is-shown', false)
}
</script>

<template>
  <div v-if="title" class="modal-pane__header">
    <h3>{{ title }}</h3>
    <app-icon :name="ICON_NAMES.close" @click="closeModal" />
  </div>
</template>

<style lang="scss" scoped>
.modal-pane__header {
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

  h3 {
    font-weight: 600;
  }

  .app-icon {
    cursor: pointer;
  }
}
</style>
