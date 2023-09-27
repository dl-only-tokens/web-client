<script setup lang="ts">
import { Erc20Interface, NativeInterface } from '@/composables'
import { Chain } from '@/helpers'

defineProps<{
  receiverToken: Erc20Interface | NativeInterface
  receiver: string
  toDefaultNetwork: Chain
}>()
</script>

<template>
  <div class="recipient-info">
    <h1 class="title">Invoice</h1>
    <section class="info-section">
      <h2 class="info-section__subtitle">Invoice information</h2>
      <div class="info-section__block">
        <p class="info-section__block__name">Recipient currency</p>
        <span class="info-section__block__value">{{
          receiverToken.symbol.value.length > 0 ? receiverToken.symbol.value : '-'
        }}</span>
      </div>
      <div class="info-section__block">
        <p class="info-section__block__name">Recipient address</p>
        <span class="info-section__block__value">0x{{ receiver.toLowerCase() }}</span>
      </div>
      <div class="info-section__block">
        <p class="info-section__block__name">Recipient network</p>
        <span class="info-section__block__value">{{ toDefaultNetwork.name }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.recipient-info {
  .title {
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;
    text-align: center;
    margin-bottom: 16px;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 32px;

    @include respond-to(mobile) {
      padding: 16px;
      gap: 16px;
    }

    border-radius: 16px;
    border: 1px solid var(--border-secondary);

    &__subtitle {
      font-size: 22px;
      font-weight: 500;
      line-height: 30px;

      @include respond-to(mobile) {
        font-size: 20px;
      }
    }

    &__block {
      display: flex;
      flex-direction: column;
      gap: 8px;

      @include respond-to(mobile) {
        font-size: 6px;
      }

      &__name {
        color: var(--text-secondary);
        font-size: 16px;

        @include respond-to(mobile) {
          font-size: 14px;
        }
      }

      &__value {
        color: var(--text-primary);
        font-size: 16px;
        line-height: 24px;
        word-wrap: break-word;

        @include respond-to(mobile) {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
