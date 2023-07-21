<template>
  <div class="modal-pane__footer">
    <slot />
  </div>
</template>

<style lang="scss">
.modal-pane__footer {
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
