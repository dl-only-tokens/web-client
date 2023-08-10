<script setup lang="ts">
import { AppButtonOutline, AppContainer, AppIcon } from '@/components/common'
import { ICON_NAMES } from '@/enums'
import { useRouter } from '@/plugins'

const router = useRouter()
</script>

<template>
  <app-container>
    <div class="payment-success">
      <app-icon :name="ICON_NAMES.flagSuccess" />
      <h4>Payment successful</h4>
      <span>Your payment has been sent for processing.</span>
      <app-button-outline name="Pay agin" @click="() => router.back()" />
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

  h4 {
    margin-top: 8px;
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;

    @include respond-to(mobile) {
      font-size: 20px;
    }
  }

  span {
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
