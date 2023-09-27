<script setup lang="ts">
import { PaymentToken } from '@rarimo/nft-checkout'
import { ref } from 'vue'

import { Erc20Interface, NativeInterface } from '@/composables'

defineProps<{
  receiverToken: Erc20Interface | NativeInterface
  selectedAmount?: string
  selectedCurrency?: PaymentToken
  payInfo: {
    amountIn: string
    impact: string
  }
}>()

const isPriceConversionLoad = ref<boolean>(false)
// END
</script>

<template>
  <div class="balance-info">
    <span class="balance-info__title">Your balance</span>
    <div class="balance-info__block">
      <p class="balance-info__block__title">Wallet balance</p>
      <span v-if="selectedCurrency" class="balance-info__block__value">
        {{ selectedCurrency.balance }} {{ selectedCurrency.symbol }}
      </span>
      <span v-else class="balance-info__block__value">0</span>
    </div>
  </div>
  <div class="payment-info">
    <span class="payment-info__title">You have to pay</span>
    <div class="payment-info__section">
      <div class="payment-info__section__block">
        <p class="payment-info__section__block__title">Price conversion</p>
        <span v-if="payInfo.amountIn.length" class="payment-info__section__block__value">
          {{ payInfo.amountIn }} {{ selectedCurrency?.symbol }} = {{ selectedAmount }}
          {{ receiverToken.symbol.value }}
        </span>
        <span v-else-if="!payInfo.amountIn.length && isPriceConversionLoad" class="payment-info__section__block__value">
          Loading...
        </span>
        <span v-else class="payment-info__section__block__value">0</span>
      </div>
      <div class="payment-info__section__block">
        <p class="payment-info__section__block__title">Price Impact</p>
        <span class="payment-info__section__block__value">
          {{ payInfo.impact.length ? `${payInfo.impact}%` : '0' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.balance-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title {
    font-weight: 500;
  }

  &__block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 12px;
    background: var(--bg-tertiary);
    height: 84px;
    padding: 0 16px;
    gap: 4px;

    &__title {
      color: var(--text-secondary);
      font-size: 16px;
      line-height: 24px;
    }

    &__value {
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
  }
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title {
    font-weight: 500;
  }

  &__section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 12px;
    background: var(--bg-tertiary);

    &__block {
      padding: 16px;
      display: flex;
      justify-content: space-between;

      &__title {
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 20px;
      }

      &__value {
        color: var(--text-primary);
        font-size: 14px;
        line-height: 20px;
      }

      &:first-child {
        border-bottom: 1px solid var(--border-secondary);

        &__value {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
        }
      }
    }
  }
}
</style>
