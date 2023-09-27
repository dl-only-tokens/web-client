<script setup lang="ts">
import { ref } from 'vue'

import { AppIcon } from '@/components/common'
import { PaymentTransfer } from '@/components/pages/Wallet.vue'
import { ICON_NAME } from '@/enums'

defineProps<{
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
    <div class="payments__container">
      <div v-if="!payments || !payments.length" class="payments__not-found">
        <app-icon :name="ICON_NAME.closeFlag" />
        <span class="payments__not-found__description">Payments for this address were not found</span>
      </div>
      <div
        v-for="(payment, i) in payments"
        :key="i"
        :class="{ payments__item: true, payments__item_active: activeRows[i] }"
      >
        <div class="payments__item__info">
          <span>{{ i + 1 }}</span>
          <p>
            <span>{{ payment.date }}</span>
            <span class="time">{{ payment.time }}</span>
          </p>
          <span>{{ payment.amount }} {{ payment.currency }}</span>
          <div class="arrow" @click="() => onClickPaymentRow(i)">
            <app-icon :name="ICON_NAME.arrow" />
          </div>
        </div>
        <div class="payments__item__additional">
          <div class="additional-block">
            <div class="additional-block__network-info">
              <span class="additional-block__network">TxHash in {{ payment.networkFrom.name }}</span>
              <a class="additional-block__explorer" :href="payment.networkFrom.explorerLink" target="_blank">
                View on explorer
              </a>
            </div>
            <span class="additional-block__tx-hash">{{ payment.networkFrom.txHash }}</span>
          </div>
          <div v-if="payment.networkFrom.name !== payment.networkTo.name" class="additional-block">
            <div class="additional-block__network-info">
              <span class="additional-block__network">TxHash in {{ payment.networkTo.name }}</span>
              <a class="additional-block__explorer" :href="payment.networkTo.explorerLink" target="_blank">
                View on explorer
              </a>
            </div>
            <span>{{ payment.networkTo.txHash }}</span>
          </div>
          <div class="additional-block">
            <div class="additional-block__network-info">
              <span class="additional-block__network">Sender's address</span>
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

  &__not-found {
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

    &__description {
      color: var(--text-secondary);
      font-size: 16px;
      line-height: 24px;
      text-align: center;

      @include respond-to(mobile) {
        font-size: 14px;
      }
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__item {
    &:nth-of-type(odd) {
      background: var(--bg-secondary);
    }

    &.payments__item_active {
      .arrow {
        transform: rotate(180deg);
      }

      .payments__item__additional {
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

    &__info {
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

      .time {
        color: var(--text-secondary);
        margin-left: 8px;
      }

      .arrow {
        display: flex;
        justify-content: end;
        cursor: pointer;
      }
    }

    &__additional {
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

      .additional-block {
        display: flex;
        flex-direction: column;
        gap: 12px;

        &__network-info {
          display: flex;
          justify-content: space-between;
        }

        &__network {
          color: var(--text-secondary);
        }

        &__explorer {
          color: #699cff;

          &:hover {
            text-decoration: underline;
          }
        }

        &__tx-hash {
          overflow-wrap: anywhere;
        }
      }
    }
  }
}
</style>
