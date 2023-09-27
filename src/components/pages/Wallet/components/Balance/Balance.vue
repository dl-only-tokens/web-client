<script setup lang="ts">
import { ref } from 'vue'

import { AppButton } from '@/components/common'
import { ModalWithdrawTokens } from '@/components/pages/Wallet/components/Balance/components'
import { Erc20Interface, NativeInterface } from '@/composables'
import { formatUnits, toBn } from '@/plugins'

const props = defineProps<{
  token: Erc20Interface | NativeInterface
  accountBalance?: string
  loadAccountBalance: () => Promise<void>
}>()

const isShowModal = ref<boolean>(false)

const closeModal = () => {
  isShowModal.value = false
}
</script>

<template>
  <section class="balance">
    <h1>Total balance</h1>
    <div class="balance__container">
      <div class="balance__container__info">
        <span class="balance__container__info__value">{{
          formatUnits(accountBalance, { decimals: props.token.decimals.value, decimalPlaces: 8 })
        }}</span>
        <span class="balance__container__info__symbol">{{ props.token.symbol.value }}</span>
      </div>
      <app-button v-if="toBn(accountBalance).isGreaterThan(0)" title="Send" @click="() => (isShowModal = true)" />
    </div>
    <modal-withdraw-tokens
      :token="token"
      :is-show-modal="isShowModal"
      :account-balance="accountBalance"
      :load-account-balance="loadAccountBalance"
      :close-modal="closeModal"
    />
  </section>
</template>

<style scoped lang="scss">
.balance {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @include respond-to(medium) {
    gap: 12px;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 92px;
    width: 100%;
    border: 1px solid var(--border-secondary);
    border-radius: 16px;

    @include respond-to(mobile) {
      flex-direction: column;
      padding: 24px;
      gap: 16px;
      height: auto;
      justify-content: center;

      .app-button {
        width: 100%;
      }
    }

    &__info {
      display: flex;
      align-items: end;
      gap: 6px;
      color: var(--text-primary);

      &__value {
        font-family: var(--font-family-secondary);
        font-size: 28px;
        font-weight: 600;
        line-height: 32px;
      }

      &__symbol {
        font-family: var(--font-family-primary);
        font-size: 16px;
        font-weight: 400;
        line-height: 25px;
      }
    }
  }
}
</style>
