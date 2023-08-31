<script setup lang="ts">
import {
  BridgeChain,
  CheckoutOperation,
  createCheckoutOperation,
  EVMOperation,
  PaymentToken,
  Price,
} from '@rarimo/nft-checkout'
import { Provider, Providers } from '@rarimo/provider'
import { EthersProvider } from '@rarimo/providers-evm'
import { ethers } from 'ethers'
import { ref, toRaw, watch } from 'vue'
import { onMounted } from 'vue'

import { AppButton, AppContainer, AppInput, AppRadio, AppRadioOptions, AppSelect } from '@/components/common'
import { ConnectWallet } from '@/components/pages/Checkout'
import { useERC20, useNative, useNotifications } from '@/composables'
import { config } from '@/config'
import { ROUTE_NAMES } from '@/enums'
import { Chain, getChainInfoById, getChainInfoByName } from '@/helpers'
import {
  formatUnits,
  getRandomHexString,
  parseEther,
  stringToBytes,
  toBn,
  useRoute,
  useRouter,
  zeroAddress,
} from '@/plugins'
import { useAccountStore, useProviderStore } from '@/store'

// Configure router and params
const route = useRoute()
const router = useRouter()
const receiver = route.params.receiver as string

// Configure provider and params
const providerStore = useProviderStore()
const accountStore = useAccountStore()
providerStore.initWeb3Provider()

// Configure notifications
const notifications = useNotifications()

// START configure page variables
const isReceiverTokenNative = config.SELLER_TOKEN === zeroAddress
const receiverToken = isReceiverTokenNative ? useNative() : useERC20()
const minReceiveAmount = ref()

const toDefaultNetwork = getChainInfoById(config.SWAP_DEFAULT_TO_CHAIN)

const formNetworks = ref()
const formDefaultNetwork = ref<string | undefined>()
const formCurrencies = ref<AppRadioOptions[]>([])

const checkoutOperation = ref<CheckoutOperation | undefined>()
const supportedNetworks = ref<BridgeChain[] | undefined>()
const supportedCurrencies = ref<PaymentToken[] | undefined>()
const selectedAmount = ref<string | undefined>()
const selectedNetwork = ref<Chain | undefined>()
const selectedCurrency = ref<PaymentToken | undefined>()
const payInfo = ref({
  amountIn: '',
  impact: '0',
})

const isPriceConversionLoad = ref<boolean>(false)
const isTxInProgress = ref<boolean>(false)
// END

const init = async () => {
  const provider = new Provider(EthersProvider)
  try {
    await provider.init({
      name: Providers.Ethers,
      instance: toRaw(providerStore.browserProvider),
    })

    await receiverToken.init(isReceiverTokenNative ? config.SWAP_DEFAULT_TO_CHAIN : config.SELLER_TOKEN)

    minReceiveAmount.value = formatUnits('1', receiverToken.decimals.value, false, receiverToken.decimals.value)

    checkoutOperation.value = createCheckoutOperation(EVMOperation, provider)

    const _supportedNetworks = await checkoutOperation.value.getSupportedChains()
    supportedNetworks.value = _supportedNetworks.filter(v => config.SWAP_CHAINS.includes(v.id.toString()))
    formNetworks.value = supportedNetworks.value.map(v => getChainInfoById(v.id).name)
  } catch {
    console.error('Browser provider is not defined')
  }
}

// On amount change, skip to default `payInfo`
const onAmountChange = () => {
  _resetCurrencyForm(false)

  payInfo.value = {
    amountIn: '',
    impact: '0',
  }
}

// On amount blur, recalculate available currency list
const onAmountBlur = async (v: string) => {
  if (/^\d+.*\.$/.test(v) || /^0*$/.test(v) || !selectedNetwork.value) {
    return
  }

  if (toBn(v).isLessThan(minReceiveAmount.value)) {
    notifications.showToastError(
      `The number is too low. Minimal available amount is ${minReceiveAmount.value} ${receiverToken.symbol.value}`,
    )

    return
  }

  selectedAmount.value = v
  await _recalculateAvailableCurrencies(selectedNetwork.value, selectedAmount.value)
}

// On network change, recalculate available currency list, only if amount setted
const onNetworkChange = async (v: string) => {
  selectedNetwork.value = getChainInfoByName(v)
  if (selectedAmount.value) {
    await _recalculateAvailableCurrencies(selectedNetwork.value, selectedAmount.value)
  }
}

// On currency change, recalculate `payInfo`
const onCurrencyChange = async (v: string | undefined) => {
  if (!v || !selectedAmount.value || !checkoutOperation.value) {
    return
  }

  selectedCurrency.value = supportedCurrencies.value?.find(e => e.symbol.toLowerCase() === v.toLowerCase())
  if (!selectedCurrency.value) {
    return
  }

  payInfo.value = {
    amountIn: '',
    impact: '0',
  }
  isPriceConversionLoad.value = true

  const estimatedPrice = await checkoutOperation.value.estimatePrice([selectedCurrency.value])
  payInfo.value = {
    amountIn: formatUnits(estimatedPrice[0].amountIn.value, estimatedPrice[0].amountIn.decimals, true, 18),
    impact: estimatedPrice[0].impact ?? '',
  }

  isPriceConversionLoad.value = false
}

// Form submit
const onClickFormSubmit = async () => {
  if (
    !checkoutOperation.value ||
    !selectedCurrency.value ||
    !selectedNetwork.value ||
    !accountStore.browserWallet.address
  ) {
    return
  }

  isTxInProgress.value = true

  const amountWei = parseEther(selectedAmount.value, receiverToken.decimals.value)

  const paymentId = getRandomHexString().slice(2)
  const toChainId = toDefaultNetwork.id
  const fromChainId = selectedNetwork.value.id
  const currency = receiverToken.symbol.value
  const sender = accountStore.browserWallet.address.slice(2)

  const paymentString = `fa1afb7a:${paymentId}:${fromChainId}:${toChainId}:${amountWei}:${currency}:${receiver}:${sender};`
  const paymentBytesString = stringToBytes(paymentString)

  const bundle = ethers.utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'bytes[]'],
    [[receiver], ['0'], [paymentBytesString]],
  )

  const estimatedPrice = await checkoutOperation.value.estimatePrice([selectedCurrency.value])

  notifications.showToastInfo('Transaction has been sent to processing, please wait.')

  try {
    const txHash = await checkoutOperation.value.checkout(estimatedPrice, { bundle })

    notifications.showToastSuccess({
      message: 'Transfer completed successfully.',
      link: {
        label: 'View transaction',
        href: `${selectedNetwork.value.explorerUrl}/tx/${txHash}`,
      },
    })

    router.push({ name: ROUTE_NAMES.paymentSuccess })
  } catch {
    notifications.showToastError('The user rejected the transaction.')
  }

  isTxInProgress.value = false
}

// Recalculate available currencies
const _recalculateAvailableCurrencies = async (chain: Chain, amount: string) => {
  if (!checkoutOperation.value) {
    return
  }

  payInfo.value = {
    amountIn: '',
    impact: '0',
  }

  _resetCurrencyForm(true)

  // Restore new available currencies
  const params = {
    chainIdFrom: chain.id,
    chainIdTo: config.SWAP_DEFAULT_TO_CHAIN,
    price: Price.fromRaw(
      amount,
      receiverToken.decimals.value,
      receiverToken.symbol.value,
      receiverToken.address.value === zeroAddress ? undefined : receiverToken.address.value,
    ),
    recipient: receiver,
  }

  try {
    await checkoutOperation.value.init(params)
    supportedCurrencies.value = await checkoutOperation.value.getPaymentTokens()
    if (!supportedCurrencies.value.length) {
      formCurrencies.value = [{ label: 'Not found', value: '0', attrs: { disabled: true } }]
    } else {
      formCurrencies.value = supportedCurrencies.value.map(v => {
        return {
          label: v.symbol,
          value: v.symbol,
        }
      })
    }
  } catch (e) {
    console.error(e)

    notifications.showToastError('Failed to load available token list')
    formCurrencies.value = [{ label: 'Not found', value: '0', attrs: { disabled: true } }]
  }
}

// Reset currency form
const _resetCurrencyForm = (isLoadingLabel: boolean) => {
  selectedCurrency.value = undefined
  formCurrencies.value = [{ label: isLoadingLabel ? 'Loading...' : 'Not found', value: '0', attrs: { disabled: true } }]
}

// Setup form default values
const _setupFormDefaultValues = () => {
  if (!accountStore.browserWallet.address) {
    return
  }

  const accountNetwork = supportedNetworks.value?.find(e => e.id === accountStore.browserWallet.chainId)
  const connectToNetwork = accountNetwork
    ? getChainInfoById(accountNetwork.id)
    : getChainInfoById(config.SWAP_DEFAULT_FROM_CHAIN)

  formDefaultNetwork.value = connectToNetwork.name
  selectedNetwork.value = connectToNetwork

  _resetCurrencyForm(false)
}

onMounted(async () => {
  await init()
  _setupFormDefaultValues()
})

const test = () => {
  router.push({ name: ROUTE_NAMES.paymentSuccess })
}

watch(() => accountStore.browserWallet.address, _setupFormDefaultValues)
</script>

<template>
  <app-container>
    <div class="checkout-container">
      <connect-wallet />
      <div>
        <h1>Invoice</h1>
        <section class="checkout-container__invoice-section">
          <h2>Invoice information</h2>
          <div class="text-container">
            <p>Recipient currency</p>
            <span>{{ receiverToken.symbol.value.length > 0 ? receiverToken.symbol.value : '-' }}</span>
          </div>
          <div class="text-container">
            <p>Recipient address</p>
            <span>0x{{ receiver.toLowerCase() }}</span>
          </div>
          <div class="text-container">
            <p>Recipient network</p>
            <span>{{ toDefaultNetwork.name }}</span>
          </div>
        </section>
      </div>
      <form-kit type="form" :actions="false" :incomplete-message="false" @submit="onClickFormSubmit">
        <section class="checkout-container__invoice-section">
          <h2>Buyer information</h2>
          <div class="text-container">
            <p>Sender address</p>
            <span>{{ accountStore.browserWallet?.address ?? 'No address' }}</span>
          </div>
          <div v-if="accountStore.browserWallet?.address" class="form-container">
            <app-input
              name="amount"
              label="Amount of tokens for the receiver"
              placeholder="100"
              validation="required|number"
              :disabled="isTxInProgress || isPriceConversionLoad"
              @change="onAmountChange"
              @blur="onAmountBlur"
            />
            <app-select
              name="network"
              label="Sender network"
              :options="formNetworks"
              :default-value="formDefaultNetwork"
              :disabled="isTxInProgress || isPriceConversionLoad"
              placeholder="Select network"
              validation="required"
              @change="onNetworkChange"
            />
            <app-radio
              name="currency"
              label="Sender currency"
              :options="formCurrencies"
              :disabled="isTxInProgress || isPriceConversionLoad"
              validation="required"
              @change="onCurrencyChange"
            />
            <div class="checkout-container__invoice-section__card-info balance">
              <span>Your balance</span>
              <div class="card">
                <p>Wallet balance</p>
                <span v-if="selectedCurrency">{{ selectedCurrency.balance }} {{ selectedCurrency.symbol }}</span>
                <span v-else>0</span>
              </div>
            </div>
            <div class="checkout-container__invoice-section__card-info pay">
              <span>You have to pay</span>
              <div class="card">
                <div>
                  <p>Price conversion</p>
                  <span v-if="payInfo.amountIn.length"
                    >{{ payInfo.amountIn }} {{ selectedCurrency?.symbol }} = {{ selectedAmount }}
                    {{ receiverToken.symbol.value }}</span
                  >
                  <span v-else-if="!payInfo.amountIn.length && isPriceConversionLoad">Loading...</span>
                  <span v-else>0</span>
                </div>
                <div>
                  <p>Price Impact</p>
                  <span>{{ payInfo.impact.length ? `${payInfo.impact}%` : '0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <app-button
          v-if="accountStore.browserWallet?.address"
          :disabled="!payInfo.amountIn.length"
          :loaded="isTxInProgress"
          name="Send"
        />
      </form-kit>
      <app-button name="AAA" @click="test" />
    </div>
  </app-container>
</template>

<style scoped lang="scss">
.checkout-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 90px;

  @include respond-to(medium) {
    margin-bottom: 0;
  }

  @include respond-to(mobile) {
    gap: 16px;
  }

  & > div > h1 {
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;
    text-align: center;
    margin-bottom: 16px;
  }

  &__invoice-section {
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

    & > h2 {
      font-size: 22px;
      font-weight: 500;
      line-height: 30px;

      @include respond-to(mobile) {
        font-size: 20px;
      }
    }

    & > div.form-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    & > div.text-container {
      display: flex;
      flex-direction: column;
      gap: 8px;

      @include respond-to(mobile) {
        font-size: 6px;
      }

      & > p {
        color: var(--text-secondary);
        font-size: 16px;

        @include respond-to(mobile) {
          font-size: 14px;
        }
      }

      & > span {
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

    &__card-info {
      display: flex;
      flex-direction: column;
      gap: 12px;

      & > span {
        font-weight: 500;
      }

      &.balance .card {
        height: 84px;
        padding: 0 16px;
        gap: 4px;
      }

      .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 12px;
        background: var(--bg-tertiary);

        & > p {
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 24px;
        }

        & > span {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
        }

        & > div {
          padding: 16px;
          display: flex;
          justify-content: space-between;

          &:first-child {
            border-bottom: 1px solid var(--border-secondary);

            & > span {
              color: var(--text-primary);
              font-size: 16px;
              font-weight: 500;
              line-height: 24px;
            }
          }

          & > p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 20px;
          }

          & > span {
            color: var(--text-primary);
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }

  button {
    margin-top: 24px;
    width: 100%;
  }
}
</style>
