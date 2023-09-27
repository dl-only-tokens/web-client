<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <div :class="{ 'form-kit-styled-container': true, 'form-kit-styled-container_disabled': disabled }">
    <slot />
  </div>
</template>

<style lang="scss">
.form-kit-styled-container {
  &.form-kit-styled-container_disabled {
    label {
      cursor: unset;
      color: var(--disable-primary);
    }

    .formkit-help {
      color: var(--disable-primary);
    }
  }

  label {
    color: var(--text-primary);
    font-family: var(--font-family-primary);
    font-size: 14px;
    line-height: 20px;

    display: block;
    margin-bottom: 8px;

    cursor: pointer;
  }

  .formkit-help {
    color: var(--text-primary);
    font-family: var(--font-family-primary);
    font-size: 12px;
    line-height: 20px;

    display: block;
    margin-top: 8px;
  }

  .formkit-messages {
    margin-top: 8px;

    .formkit-message {
      color: var(--state-error-primary);
      font-family: var(--font-family-primary);
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
