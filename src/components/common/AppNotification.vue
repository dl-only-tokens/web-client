<script lang="ts" setup>
import { ICON_NAMES } from '@/enums'

import AppIcon from './AppIcon.vue'

defineProps<{
  title: string
  message: string
  iconName: ICON_NAMES
  link?: {
    label: string
    href: string
  }
}>()
</script>

<template>
  <div class="notification">
    <div class="notification__icon">
      <app-icon :name="iconName" />
    </div>
    <div class="notification__details">
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
      <a v-if="link" class="notification__link" :href="link.href" target="_blank">
        {{ link.label }}
      </a>
    </div>
  </div>
</template>

<style lang="scss">
@import 'vue-toastification/src/scss/index';

.Vue-Toastification__container.top-right {
  top: 92px;
  right: calc(50% - 664px);

  @include respond-to(1355px) {
    right: 24px;
  }

  @include respond-to(600px) {
    padding: 0 24px;
  }

  @include respond-to(mobile) {
    padding: 0 16px;
  }
}

.Vue-Toastification__toast {
  width: 380px;
  max-width: 380px;
  border-radius: 16px;
  background: var(--bg-tertiary);
  padding: 16px;

  @include respond-to(600px) {
    max-width: none;
  }

  &--success .notification__icon {
    background: var(--state-success-secondary);
  }

  &--error .notification__icon {
    background: var(--state-error-secondary);
  }

  &--info .notification__icon {
    background: var(--state-info-secondary);
  }
}

.Vue-Toastification__toast-component-body {
  width: calc(100% - 38px);
}

.notification {
  display: flex;
  gap: 16px;

  .notification__icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }

  .notification__details {
    display: flex;
    flex-direction: column;
    width: calc(100% - 64px);

    h4 {
      color: var(--text-text-primary);
      font-family: var(--font-family-inter);
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
    p {
      color: var(--text-secondary);
      font-family: var(--font-family-inter);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      word-wrap: break-word;
    }
  }
}

.Vue-Toastification__close-button {
  padding: 12px;
  display: flex;
  align-items: baseline;
  width: 38px;
}
</style>
