<script setup lang="ts">
import { ROUTE_NAMES } from '@/enums'
</script>

<template>
  <footer>
    <router-link :to="{ name: ROUTE_NAMES.termsOfUse }">Terms of use</router-link>
    <router-link :to="{ name: ROUTE_NAMES.privacyPolicy }">Privacy Policy</router-link>
  </footer>
</template>

<style scoped lang="scss">
footer {
  min-height: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  border-top: 1px solid var(--border-secondary);
  margin-top: 32px;
  z-index: 2;
  background: var(--bg-primary);

  router-link {
    font-family: var(--font-family-inter);
    color: var(--text-secondary);
    font-size: 16px;
  }
}
</style>
