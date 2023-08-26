<script setup lang="ts">
import { ref } from 'vue'

import { AppIcon } from '@/components/common'
import { Erc20Contract, NativeToken } from '@/composables'
import { ICON_NAMES } from '@/enums'

import { PaymentTransfer } from '../PageWallet.vue'

defineProps<{
  sellerToken: Erc20Contract | NativeToken
  payments?: PaymentTransfer[]
}>()

const activeRows = ref<{ [key: number]: boolean }>({})

const onClickPaymentRow = (i: number) => {
  activeRows.value[i] = !activeRows.value[i]
}
</script>

<template>
  <section class="payments">
    <h1>Payments</h1>
    <div>
      <div v-if="!payments || !payments.length" class="payment__not-found">
        <app-icon :name="ICON_NAMES.closeFlag" />
        <span>Payments for this address were not found</span>
      </div>
      <div v-for="(payment, i) in payments" :key="i" :class="{ payment__row: true, active: activeRows[i] }">
        <div class="row">
          <span>{{ i + 1 }}</span>
          <p>
            <span>{{ payment.date }}</span>
            <span>{{ payment.time }}</span>
          </p>
          <span>{{ payment.amount }} {{ payment.currency }}</span>
          <div @click="() => onClickPaymentRow(i)">
            <app-icon :name="ICON_NAMES.arrow" />
          </div>
        </div>
        <div class="row__info">
          <div class="row__info-block">
            <div>
              <span>TxHash in {{ payment.networkFrom.name }}</span>
              <a :href="payment.networkFrom.explorerLink" target="_blank">View on explorer</a>
            </div>
            <span>{{ payment.networkFrom.txHash }}</span>
          </div>
          <div v-if="payment.networkFrom.name !== payment.networkTo.name" class="row__info-block">
            <div>
              <span>TxHash in {{ payment.networkTo.name }}</span>
              <a :href="payment.networkTo.explorerLink" target="_blank">View on explorer</a>
            </div>
            <span>{{ payment.networkTo.txHash }}</span>
          </div>
          <div class="row__info-block">
            <div>
              <span>Sender's address</span>
            </div>
            <span>{{ payment.sender }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.payments {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include respond-to(medium) {
    gap: 12px;
  }

  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;

    .payment__not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 154px;
      border-radius: 16px;
      background: #1a1a1a;
      padding: 24px;

      @include respond-to(mobile) {
        flex-direction: column;
      }

      span {
        color: var(--text-secondary);
        font-size: 16px;
        line-height: 24px;
        text-align: center;

        @include respond-to(mobile) {
          font-size: 14px;
        }
      }
    }
    .payment__row {
      &:nth-of-type(odd) {
        background: var(--bg-secondary);
      }

      .row {
        display: grid;
        grid-template-columns: 1fr 1.5fr 1.5fr 0.25fr;
        height: 76px;
        align-items: center;
        border-bottom: 1px solid var(--border-tertiary);
        padding: 0 24px;
        z-index: 1;
        position: relative;

        @include respond-to(medium) {
          grid-template-columns: 0.5fr 2fr 1.5fr 0.25fr;
        }

        span {
          font-size: 16px;

          @include respond-to(mobile) {
            font-size: 14px;
          }
        }

        p span:last-child {
          color: var(--text-secondary);
          margin-left: 8px;
        }

        & > div:last-child {
          display: flex;
          justify-content: end;
          cursor: pointer;
        }
      }

      .row__info {
        height: 0;
        opacity: 0;
        transition: all 0.25s ease-out;
        padding: 0 24px;
        gap: 24px;
        display: flex;
        flex-direction: column;

        * {
          display: none;
        }

        .row__info-block {
          display: flex;
          flex-direction: column;
          gap: 12px;

          & > div {
            display: flex;
            justify-content: space-between;

            span {
              color: var(--text-secondary);
            }

            a {
              color: #699cff;

              &:hover {
                text-decoration: underline;
              }
            }
          }

          span {
            overflow-wrap: anywhere;
          }
        }
      }

      &.active {
        .row > div:last-child > svg {
          transform: rotate(180deg);
        }
        .row__info {
          height: 236px;
          opacity: 1;
          padding: 16px 24px;

          * {
            display: flex;
          }

          @include respond-to(medium) {
            height: 276px;
          }
        }
      }
    }
  }
}
</style>
