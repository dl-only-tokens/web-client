<script setup lang="ts">
import { ref } from 'vue'

import { AppButton, AppInput, AppModal, AppModalFooter, AppModalHeader } from '@/components/common'
import { Erc20Interface, NativeInterface, useNotifications } from '@/composables'
import { formatUnits, parseEther, toBn } from '@/plugins'

const props = defineProps<{
  token: Erc20Interface | NativeInterface
  isShowModal: boolean
  accountBalance?: string
  loadAccountBalance: () => Promise<void>
  closeModal: () => void
}>()

const notifications = useNotifications()

const isTxPending = ref<boolean>(false)
const enteredAmount = ref<string>('0')

const onSubmitSendTokens = async (fields: { [key: string]: string }) => {
  if (toBn(props.accountBalance).isLessThan(parseEther(enteredAmount.value, props.token.decimals.value))) {
    notifications.showToastError(
      `Withdraw amount should be less than ${formatUnits(props.accountBalance, {
        decimals: props.token.decimals.value,
        decimalPlaces: 8,
      })} ${props.token.symbol.value}.`,
    )

    return
  }

  if (toBn(enteredAmount.value).isLessThanOrEqualTo('0')) {
    notifications.showToastError(`Can't withdraw invalid amount.`)

    return
  }

  try {
    isTxPending.value = true
    await props.token.transferSigned(
      fields.recipient,
      parseEther(enteredAmount.value, props.token.decimals.value).toString(),
    )
    await props.loadAccountBalance()
    isTxPending.value = false
  } catch (e) {
    notifications.showToastError('An error occurred while forming a transaction.')
  }
}
</script>

<template>
  <app-modal :is-show="isShowModal" title="Send" @on:close="closeModal">
    <app-modal-header title="Send" @click="closeModal" />
    <form-kit type="form" :actions="false" :incomplete-message="false" @submit="onSubmitSendTokens">
      <div class="app-modal__body">
        <app-input
          name="amount"
          label="Amount"
          placeholder="100"
          validation="required|number"
          @change="v => (enteredAmount = v)"
        />
        <app-input name="recipient" label="Recipient address" placeholder="0x" validation="required|etherAddress" />
        <div class="app-modal__body__card">
          <div class="app-modal__body__card__container">
            <div class="app-modal__body__card__item">
              <span class="app-modal__body__card__item__name">Wallet balance</span>
              <span class="app-modal__body__card__item__value">
                {{ formatUnits(accountBalance, { decimals: props.token.decimals.value, decimalPlaces: 8 }) }}
                {{ props.token.symbol.value }}
              </span>
            </div>
            <div class="app-modal__body__card__item">
              <span class="app-modal__body__card__item__name">Transfer amount</span>
              <span class="app-modal__body__card__item__value">
                {{ formatUnits(toBn(enteredAmount), { decimals: 0, decimalPlaces: 8 }) }}
                {{ props.token.symbol.value }}
              </span>
            </div>
          </div>
          <div class="app-modal__body__card__item">
            <span class="app-modal__body__card__item__name">Remaining balance</span>
            <span class="app-modal__body__card__item__value">
              {{
                formatUnits(toBn(accountBalance).minus(parseEther(enteredAmount, props.token.decimals.value)), {
                  decimals: props.token.decimals.value,
                  decimalPlaces: 8,
                })
              }}
              {{ props.token.symbol.value }}
            </span>
          </div>
        </div>
      </div>
      <app-modal-footer>
        <app-button title="Send" :loading="isTxPending" />
      </app-modal-footer>
    </form-kit>
  </app-modal>
</template>

<style scoped lang="scss">
.app-modal {
  &__body {
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @include respond-to(mobile) {
      padding: 16px;
    }

    &__card {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &__container {
        display: flex;
        gap: 12px;

        @include respond-to(medium) {
          flex-direction: column;
        }
      }

      &__item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 76px;
        border-radius: 12px;
        background: var(--bg-tertiary);
        padding: 12px;
        width: 100%;
        min-width: calc(50% - 6px);

        &__value {
          font-size: 16px;
          overflow: hidden;
          white-space: nowrap;

          @include respond-to(mobile) {
            font-size: 14px;
          }
        }

        &__name {
          font-size: 16px;
          color: var(--text-secondary);
        }
      }
    }
  }
}

.app-modal-footer {
  width: 100%;
  display: flex;
  justify-content: end;

  .app-button-container {
    width: 75px;

    @include respond-to(mobile) {
      width: 100%;
    }
  }
}
</style>
