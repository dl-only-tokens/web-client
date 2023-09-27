<script setup lang="ts">
import { ROUTE_NAME } from '@/enums'

withDefaults(
  defineProps<{
    isVisible?: boolean
  }>(),
  {
    isVisible: true,
  },
)
</script>

<template>
  <transition name="fade">
    <footer v-if="isVisible">
      <router-link :to="{ name: ROUTE_NAME.termsOfUse }">Terms of use</router-link>
      <router-link :to="{ name: ROUTE_NAME.privacyPolicy }">Privacy Policy</router-link>
    </footer>
  </transition>
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
  margin-top: 64px;
  z-index: 2;
  background: var(--bg-primary);

  router-link {
    font-family: var(--font-family-primary);
    color: var(--text-secondary);
    font-size: 16px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s ease-out;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
