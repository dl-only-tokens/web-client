<script setup lang="ts">
import { useRouter } from 'vue-router'

import { AppButtonOutline, AppContainer, AppIcon } from '@/components/common'
import { ICON_NAME } from '@/enums'

const router = useRouter()
</script>

<template>
  <app-container>
    <div class="payment-success">
      <app-icon :name="ICON_NAME.flagSuccess" />
      <h1 class="payment-success__title">Payment successful</h1>
      <p class="payment-success__description">Your payment has been sent for processing</p>
      <app-button-outline name="Pay again" @click="() => router.back()" />
    </div>
  </app-container>
</template>

<style scoped lang="scss">
.payment-success {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;

  &__title {
    margin-top: 8px;
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;

    @include respond-to(mobile) {
      font-size: 20px;
    }
  }

  &__description {
    margin: 4px 0 16px 0;
    text-align: center;
    color: var(--text-secondary);
    font-size: 16px;
    max-width: 424px;

    @include respond-to(mobile) {
      font-size: 14px;
    }
  }
}
</style>
