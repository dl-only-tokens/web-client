<template>
  <div class="app-modal-footer">
    <slot />
  </div>
</template>

<style lang="scss">
.app-modal-footer {
  display: flex;
  align-items: center;
  padding: 0 32px;
  height: 92px;
  border-top: 1px solid var(--border-tertiary);

  @include respond-to(mobile) {
    height: 76px;
    padding: 0 16px;
  }
}
</style>
