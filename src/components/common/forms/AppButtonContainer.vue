<script setup lang="ts">
defineProps<{
  disabled?: boolean
  loading?: boolean
}>()
</script>

<template>
  <button class="app-button-container" :disabled="disabled || loading" :class="{ loading: loading }">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.app-button-container {
  position: relative;
  background: -webkit-linear-gradient(225deg, #b697ff 0%, #55eba5 100%);
  border-radius: 16px;
  cursor: pointer;
  user-select: none;
  border: 0;
  opacity: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:after {
    opacity: 0.3;
  }

  &:disabled {
    cursor: unset;
    opacity: 0.7;

    &:not(.loading) {
      background: var(--disable-primary);
    }

    &:hover:after {
      opacity: 0;
    }
  }
}
</style>
