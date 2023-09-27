<script setup lang="ts">
import { ROUTE_NAME } from '@/enums'
</script>

<template>
  <header class="header">
    <div class="header__container">
      <router-link :to="{ name: ROUTE_NAME.main }">
        <span class="header__title">OnlyTokens</span>
      </router-link>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  min-height: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 32px;
  background: var(--bg-primary);
  z-index: 2;

  @include respond-to(mobile) {
    padding: 16px 16px 0 16px;
    min-height: 72px;
    height: 72px;
    margin-bottom: 16px;
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-secondary);
    border-radius: 16px;
    border: 1px solid var(--border-secondary);
    max-width: 1320px;
    width: 100%;
    height: 100%;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    background: -webkit-linear-gradient(225deg, #b697ff 0%, #55eba5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
