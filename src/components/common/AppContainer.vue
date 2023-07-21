<template>
  <div class="app-container">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
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
