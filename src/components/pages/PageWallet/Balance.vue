<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

import { AppButton, AppInput, AppModal, AppModalFooter, AppModalHeader } from '@/components/common'
import { useERC20, useNotifications } from '@/composables'
import { config } from '@/config'
import { formatUnits, parseEther, toBn } from '@/plugins'
import { useAccountStore } from '@/store'

const emit = defineEmits(['loaded'])

const notifications = useNotifications()
const accountStore = useAccountStore()
const { address } = storeToRefs(accountStore)

const token = useERC20()

const isModalShown = ref<boolean>(false)
const isTxInProgress = ref<boolean>(false)
const accountBalance = ref<string>()
const enteredAmount = ref<string>('0')

const init = async () => {
  if (!address.value) {
    return
  }

  await token.init(config.SELLER_TOKEN)
  accountBalance.value = await token.balanceOf(address.value)

  emit('loaded')
}

const onClickSendProcess = async (fields: { [key: string]: string }) => {
  try {
    isTxInProgress.value = true
    await token.transferSigned(fields.recipient, parseEther(enteredAmount.value, token.decimals.value).toString())
    await init()
    isTxInProgress.value = false
  } catch (e) {
    notifications.showToastError('An error occurred while forming a transaction.')
  }
}

init()

watch(address, init)
</script>

<template>
  <section class="total-balance">
    <h1>Total balance</h1>
    <div>
      <div>
        <span>{{ formatUnits(accountBalance, token.decimals.value) }}</span>
        <span>{{ token.symbol.value }}</span>
      </div>
      <app-button v-if="toBn(accountBalance).isGreaterThan(0)" name="Send" @click="() => (isModalShown = true)" />
      <app-modal :is-shown="isModalShown" title="Send" @update:is-shown="() => (isModalShown = false)">
        <app-modal-header title="Send" @update:is-shown="() => (isModalShown = false)" />
        <form-kit type="form" :actions="false" :incomplete-message="false" @submit="onClickSendProcess">
          <div class="modal-pane__body">
            <app-input
              name="amount"
              label="Amount"
              placeholder="100"
              :validation="`required|number|max:${formatUnits(accountBalance, token.decimals.value, false)}`"
              @change="v => (enteredAmount = v)"
            />
            <app-input name="recipient" label="Recipient address" placeholder="0x" validation="required|etherAddress" />
            <div class="card">
              <div>
                <div class="card__item">
                  <span>Wallet balance</span>
                  <span>{{ formatUnits(accountBalance, token.decimals.value) }} {{ token.symbol.value }}</span>
                </div>
                <div class="card__item">
                  <span>Transfer amount</span>
                  <span>{{ enteredAmount }}</span>
                </div>
              </div>
              <div class="card__item">
                <span>Remaining balance</span>
                <span
                  >{{
                    formatUnits(
                      toBn(accountBalance).minus(parseEther(enteredAmount, token.decimals.value)),
                      token.decimals.value,
                    )
                  }}
                  USDT</span
                >
              </div>
            </div>
          </div>
          <app-modal-footer>
            <app-button name="Send" :loaded="isTxInProgress" />
          </app-modal-footer>
        </form-kit>
      </app-modal>
    </div>
  </section>
</template>

<style scoped lang="scss">
.total-balance {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include respond-to(medium) {
    gap: 12px;
  }

  & > div {
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

      button {
        width: 100%;
      }
    }

    & > div {
      display: flex;
      align-items: end;
      gap: 6px;

      span {
        color: var(--text-primary);
      }

      span:first-child {
        font-family: var(--font-family-nunito);
        font-size: 28px;
        font-weight: 600;
        line-height: 32px;
      }

      span:last-child {
        font-family: var(--font-family-inter);
        font-size: 16px;
        font-weight: 400;
        line-height: 25px;
      }
    }
  }
}

.modal-pane__body {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @include respond-to(mobile) {
    padding: 16px;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > div {
      display: flex;
      gap: 12px;

      @include respond-to(medium) {
        flex-direction: column;
      }
    }

    .card__item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 76px;
      border-radius: 12px;
      background: var(--bg-tertiary);
      padding: 12px;
      width: 100%;
      min-width: calc(50% - 6px);

      span {
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;

        @include respond-to(mobile) {
          font-size: 14px;
        }
      }
      span:first-child {
        color: var(--text-secondary);
      }
    }
  }
}
.modal-pane__footer {
  width: 100%;
  display: flex;
  justify-content: end;

  button {
    width: 75px;

    @include respond-to(mobile) {
      width: 100%;
    }
  }
}
</style>
